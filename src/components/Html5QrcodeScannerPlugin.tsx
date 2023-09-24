// file = Html5QrcodePlugin.tsx
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, FC } from "react";

interface Html5QrcodePluginProps {
  fps?: number;
  qrbox?: number;
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  qrCodeSuccessCallback: (decodedText: string, decodedResult: any) => void; // Update these types if you have more specific details
  qrCodeErrorCallback?: (errorMessage: string) => void; // Consider adding more specific types
}

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props: Html5QrcodePluginProps) => {
  let config: {
    fps: number;
    qrbox?: number;
    aspectRatio?: number;
    disableFlip?: boolean;
  } = {
    fps: 24,
  };

  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin: FC<Html5QrcodePluginProps> = (props) => {
  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === true;

    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is required callback.");
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
