import { WhatsappShareButton, WhatsappIcon } from "react-share";

export default function WhatsAppShare({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <WhatsappShareButton url={url} title={title} className="mt-4 inline-block">
      <WhatsappIcon size={42} round />
    </WhatsappShareButton>
  );
}
