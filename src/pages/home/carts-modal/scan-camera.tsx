import { FC } from "react";
import { QrReader } from "react-qr-reader";

export const ScanCamera: FC<{ onScan: (cart_id: number) => void }> = ({
	onScan,
}) => {
	return (
		<QrReader
			constraints={{
				facingMode: "environment",
			}}
			onResult={(result) => {
				if (result) {
					onScan(Number(result.getText()));
				}
			}}
		/>
	);
};
