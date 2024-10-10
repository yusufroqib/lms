import React, {
	forwardRef,
	useImperativeHandle,
	useRef,
	useEffect,
	useState,
} from "react";
import { Stage, Layer, Image, Text } from "react-konva";
import useImage from "use-image";
import FontFaceObserver from "fontfaceobserver";
// import generateCertId from "./genCertId";
import { format } from "date-fns";
import generateCertID from "@/lib/generateCertID";

const CANVAS_WIDTH = 1414;
const CANVAS_HEIGHT = 2000;
const PADDING_X = 100;
const PADDING_Y = 100;

const CertificateCanvas = forwardRef(
	(
		{ courseTitle, userId, studentName, description, signatureUrl, certId },
		ref
	) => {
		const [background] = useImage(
			"/certificate/certificate_template.png",
			"Anonymous"
		);
		const [signature] = useImage(signatureUrl, "Anonymous");
		const [fontsLoaded, setFontsLoaded] = useState(false);
		const stageRef = useRef(null);

		useImperativeHandle(ref, () => ({
			getStage: () => stageRef.current,
			toDataURL: () => {
				if (stageRef.current) {
					try {
						return stageRef.current.toDataURL();
					} catch (error) {
						console.error("Error generating DataURL:", error);
						return null;
					}
				}
				return null;
			},
		}));

		// useEffect(() => {
		// 	generateCertID(userId).then((id) => {
		// 		setCertId(id);
		// 	});
		// }, [userId]);

		useEffect(() => {
			const pacificoFont = new FontFaceObserver("Pacifico");
			const droidSerifFont = new FontFaceObserver("Droid Serif Reg");

			Promise.all([pacificoFont.load(), droidSerifFont.load()])
				.then(() => {
					setFontsLoaded(true);
				})
				.catch((err) => {
					console.error("Font loading failed", err);
				});
		}, []);

		if (!fontsLoaded && !certId) {
			return <div>Loading fonts and certificateId...</div>;
		}

		return (
			<Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={stageRef}>
				<Layer>
					{background && (
						<Image
							image={background}
							width={CANVAS_WIDTH}
							height={CANVAS_HEIGHT}
						/>
					)}

					<Text
						text={format(new Date(), "PPP")}
						x={300}
						y={100}
						opacity={0.9}
						fontSize={22}
						fontFamily="'Droid Serif Reg', serif"
						fill="#eceaea"
						align="left"
						width={CANVAS_WIDTH - 2 * PADDING_X}
						// offsetX={(CANVAS_WIDTH - 2 * PADDING_X) / 2}
						lineHeight={1.9}
						wrap="word"
					/>
					<Text
						text={`ID: ${certId}`}
						x={720}
						y={100}
						opacity={0.9}
						fontSize={22}
						fontFamily="'Droid Serif Reg', serif"
						fill="#eceaea"
						align="left"
						width={CANVAS_WIDTH - 2 * PADDING_X}
						// offsetX={(CANVAS_WIDTH - 2 * PADDING_X) / 2}
						lineHeight={1.9}
						wrap="word"
					/>

					<Text
						text={studentName}
						x={CANVAS_WIDTH / 2}
						y={studentName.length <= 21 ? PADDING_Y + 960 : PADDING_Y + 1000}
						fontSize={
							studentName.length <= 10
								? 140
								: studentName.length <= 21
								? 100
								: studentName.length <= 31
								? 73
								: 50
						}
						fontFamily="'Pacifico', serif"
						fill="#FFDE59"
						align="center"
						width={CANVAS_WIDTH}
						offsetX={CANVAS_WIDTH / 2}
					/>

					<Text
						text={description}
						x={CANVAS_WIDTH / 2}
						y={PADDING_Y + 1130}
						fontSize={30}
						fontFamily="'Droid Serif Reg', serif"
						fill="#FEFEFE"
						align="center"
						width={CANVAS_WIDTH - 2 * PADDING_X}
						offsetX={(CANVAS_WIDTH - 2 * PADDING_X) / 2}
						lineHeight={1.9}
						wrap="word"
					/>
					<Text
						text={courseTitle}
						x={CANVAS_WIDTH / 2}
						y={PADDING_Y + 1190}
						fontSize={courseTitle.length <= 75 ? 60 : 40}
						fontFamily="'Droid Serif Reg', serif"
						fill="#bce98c"
						align="center"
						width={CANVAS_WIDTH - 2 * PADDING_X}
						offsetX={(CANVAS_WIDTH - 2 * PADDING_X) / 2}
						lineHeight={1.9}
						wrap="word"
					/>

					<Text
						text={`YUSUF ROQIB OLASUNKANMI`}
						x={CANVAS_WIDTH / 2}
						y={CANVAS_HEIGHT - PADDING_Y - 210}
						fontSize={35}
						fontFamily="'Droid Serif Reg', serif"
						fill="#FEFEFE"
						align="center"
						width={CANVAS_WIDTH}
						offsetX={CANVAS_WIDTH / 2}
					/>

					{signature && (
						<Image
							image={signature}
							x={(CANVAS_WIDTH - 300) / 2}
							y={CANVAS_HEIGHT - PADDING_Y - 370}
							width={300}
							height={150}
						/>
					)}
				</Layer>
			</Stage>
		);
	}
);

export default CertificateCanvas;
