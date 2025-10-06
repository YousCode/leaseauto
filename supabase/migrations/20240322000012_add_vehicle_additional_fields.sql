-- Add additional fields to vehicles table for comprehensive vehicle data
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS doors INTEGER,
ADD COLUMN IF NOT EXISTS power_din INTEGER,
ADD COLUMN IF NOT EXISTS power_fiscal INTEGER,
ADD COLUMN IF NOT EXISTS consumption_mixed DECIMAL(3,1),
ADD COLUMN IF NOT EXISTS co2_emissions INTEGER,
ADD COLUMN IF NOT EXISTS first_owner BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS critair INTEGER,
ADD COLUMN IF NOT EXISTS dimensions JSONB,
ADD COLUMN IF NOT EXISTS weight INTEGER,
ADD COLUMN IF NOT EXISTS seller_type TEXT DEFAULT 'pro' CHECK (seller_type IN ('pro', 'particulier')),
ADD COLUMN IF NOT EXISTS seller_info JSONB,
ADD COLUMN IF NOT EXISTS location_lat DECIMAL(10,8),
ADD COLUMN IF NOT EXISTS location_lng DECIMAL(11,8);

-- Add function to calculate monthly payment
CREATE OR REPLACE FUNCTION calculate_monthly_payment(
    price NUMERIC,
    down_payment NUMERIC DEFAULT 0,
    duration_months INTEGER DEFAULT 60,
    interest_rate DECIMAL DEFAULT 0.06
) RETURNS NUMERIC AS $$
DECLARE
    loan_amount NUMERIC;
    monthly_rate DECIMAL;
    monthly_payment NUMERIC;
BEGIN
    loan_amount := price - down_payment;
    monthly_rate := interest_rate / 12;
    
    IF monthly_rate = 0 THEN
        monthly_payment := loan_amount / duration_months;
    ELSE
        monthly_payment := loan_amount * (monthly_rate * POWER(1 + monthly_rate, duration_months)) / (POWER(1 + monthly_rate, duration_months) - 1);
    END IF;
    
    RETURN ROUND(monthly_payment, 2);
END;
$$ LANGUAGE plpgsql;

-- Add trigger to auto-calculate monthly payment
CREATE OR REPLACE FUNCTION update_monthly_payment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price IS NOT NULL THEN
        NEW.monthly := calculate_monthly_payment(NEW.price, 0, 60, 0.06);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_monthly_payment ON vehicles;
CREATE TRIGGER trg_update_monthly_payment
    BEFORE INSERT OR UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_monthly_payment();

-- Create RPC function for vehicle search
CREATE OR REPLACE FUNCTION search_vehicles(search_query TEXT)
RETURNS TABLE(
    id UUID,
    title TEXT,
    brand TEXT,
    model TEXT,
    year INTEGER,
    price NUMERIC,
    monthly NUMERIC,
    images TEXT[],
    slug TEXT,
    mileage INTEGER,
    energy TEXT,
    gearbox TEXT,
    city TEXT,
    created_at TIMESTAMP,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        v.brand,
        v.model,
        v.year::INTEGER,
        v.price,
        v.monthly,
        v.images,
        v.slug,
        v.mileage,
        v.energy,
        v.gearbox,
        v.city,
        v.created_at,
        ts_rank(v.search, plainto_tsquery('simple', search_query)) as rank
    FROM vehicles v
    WHERE 
        v.status = 'published'
        AND (
            v.search @@ plainto_tsquery('simple', search_query)
            OR v.title ILIKE '%' || search_query || '%'
            OR v.brand ILIKE '%' || search_query || '%'
            OR v.model ILIKE '%' || search_query || '%'
        )
    ORDER BY rank DESC, v.created_at DESC
    LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION search_vehicles(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_monthly_payment(NUMERIC, NUMERIC, INTEGER, DECIMAL) TO anon, authenticated;
