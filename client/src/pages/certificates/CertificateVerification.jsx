import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Search } from "lucide-react";
import queryString from "query-string";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useGetCertificateQuery } from "@/features/courses/coursesApiSlice";
import { format } from "date-fns";
import { CERTIFICATE_CA } from "@/contracts/certificate";
const MAX_LENGTH = 28;

const CertificateVerification = () => {
	const [input, setInput] = useState("");
	const [formattedInput, setFormattedInput] = useState("");
	const [certificate, setCertificate] = useState(null);
	const [error, setError] = useState("");
	const [dynamicSearchParams, setDynamicSearchParams] = useSearchParams();
	const searchParams = dynamicSearchParams.toString();
	const navigate = useNavigate();

	console.log(searchParams.toLowerCase());

	const {
		data,
		isLoading,
		isError,
		error: apiError,
	} = useGetCertificateQuery(searchParams && searchParams.toLowerCase(), {
		skip: !searchParams,
	});

	console.log(apiError);

	useEffect(() => {
		if (isError) {
			setCertificate(null);
		} else {
			setCertificate(data);
		}
	}, [data, isError]);

	useEffect(() => {
		formatInput(input);
	}, [input]);

	const formatInput = (value) => {
		if (value.toUpperCase().startsWith("LRNV")) {
			const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
			let formatted = "";
			for (let i = 0; i < Math.min(cleaned.length, MAX_LENGTH - 3); i++) {
				if (i === 4 || i === 12 || i === 20) {
					formatted += "-";
				}
				formatted += cleaned[i];
			}
			setFormattedInput(formatted);
		} else {
			// For NFT ID, just limit the length without formatting
			setFormattedInput(value.slice(0, MAX_LENGTH));
		}
	};

	const handleInputChange = (e) => {
		const newValue = e.target.value.trim();
		if (newValue.length <= MAX_LENGTH) {
			setInput(newValue);
		}
	};

	const handleVerify = async (e) => {
		e.preventDefault();
		setError("");
		const url = queryString.stringifyUrl(
			{
				url: location.pathname,
				query: {
					id: formattedInput,
				},
			},
			{ skipEmptyString: true, skipNull: true }
		);
		navigate(url);
		// try {
		//   const response = await fetch(`/api/verify-certificate?id=${formattedInput.toLowerCase()}`);
		//   if (!response.ok) {
		//     throw new Error('Certificate not found');
		//   }
		//   const data = await response.json();
		//   setCertificate(data);
		// } catch (err) {
		//   setError(err.message);
		//   setCertificate(null);
		// }
	};
	console.log(certificate?.firebaseUrl);
	return (
		<div>
			<header className="h-20 mb-6 w-full flex items-center shadow-2">
				<Link to={"/"} className="mr-6 flex">
					<img src="/learniverse-full.svg" className="h-15 " alt="logo" />
				</Link>
			</header>
			<div className="container mx-auto p-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="w-full max-w-2xl mx-auto">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-center">
								Certificate Verification
              <img src="/certificate-illustration.webp" alt="" />
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form action="" onSubmit={handleVerify}>
								<div className="flex space-x-2">
									<Input
										type="text"
										placeholder="Enter Certificate ID or NFT ID"
										value={formattedInput}
										onChange={handleInputChange}
										// maxLength={MAX_LENGTH}
										className="flex-grow"
									/>
									<Button disabled={isLoading}>
										{isLoading ? "Verifying..." : "Verify"}
										{!isLoading && <Search className="ml-2 h-4 w-4" />}
									</Button>
								</div>
							</form>

							{isError && (
								<motion.p
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-red-500 mt-4"
								>
									{apiError?.data?.error || "Internal Server Error"}
								</motion.p>
							)}

							{certificate && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
									className="mt-8"
								>
									<img
										src={certificate.firebaseUrl}
										alt="Certificate"
										className="w-full rounded-lg shadow-lg mb-4"
									/>
									<div className="space-y-2">
										<p>
											<strong>Certificate ID:</strong>{" "}
											{certificate.certificateId}
										</p>
										<p>
											<strong>Student:</strong> {certificate.student.name}
										</p>
										<p>
											<strong>Course:</strong> {certificate.course.title}
										</p>
										<p>
											<strong>Date Issued:</strong>{" "}
											{/* {new Date(certificate.date).toLocaleDateString()} */}
											{format(new Date(certificate.date), "PPPP")}
										</p>
										<div className="flex items-center space-x-2">
											<strong>Status:</strong>
											{certificate.isMinted ? (
												<div className="flex md:gap-2 items-center">
													<Badge
														variant="success"
														className="flex items-center"
													>
														<CheckCircle className="mr-1 h-4 w-4" /> Minted
													</Badge>

													<a
														href={`https://explorer.celo.org/alfajores/token/${CERTIFICATE_CA}/instance/${certificate.NFTId}/token-transfers`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<Button
															className="text-blue-500 text-xs"
															variant="link"
														>
															View on block explorer
														</Button>
													</a>
												</div>
											) : (
												<Badge
													variant="secondary"
													className="flex items-center"
												>
													<XCircle className="mr-1 h-4 w-4" /> Not Minted
												</Badge>
											)}
										</div>
										{certificate.isMinted && (
											<>
												<p>
													<strong>NFT ID:</strong> {certificate.NFTId}
												</p>
												<p className="break-all ">
													<strong>Minted Address:</strong>{" "}
													{certificate.mintedAddress}
												</p>
												<p>
													<strong>Minted Date:</strong>{" "}
													{format(new Date(certificate.mintedDate), "PPPP")}
												</p>
											</>
										)}
									</div>
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
};

export default CertificateVerification;
