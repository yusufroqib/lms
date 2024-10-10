import { useState } from "react";
("use client");
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import truncateWalletAddress from "@/lib/truncateWalletAddress";

export const ConfirmPublishModal = ({
	children,
	onConfirm,
	price,
	isPublished,
	open,
	setOpen,
}) => {
	const { _id, status, paymentWallet, stripeOnboardingComplete } = useAuth();

	const FormSchema = z.object({
		items: z
			.array(z.string())
			.refine((value) => value.some((item) => item) || !price, {
				message: "You have to select at least one item.",
			}),
	});
	const form = useForm({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			items: !price ? [] : stripeOnboardingComplete ? ["card"] : [],
		},
	});

	const items = [
		{ id: "card", label: "Card Payment" },
		{
			id: "crypto",
			label: `USDC Payment ${
				paymentWallet ? `(${truncateWalletAddress(paymentWallet)})` : ""
			}`,
		},
	];

	const { isSubmitting, isValid } = form.formState;

	return (
		<AlertDialog open={open} onOpenChange={() => setOpen(true)}>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{!isPublished && price
							? "Payment Option"
							: !isPublished && !price
							? "Publish Free Course"
							: "Unpublish Course"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{!isPublished && price
							? "Select the mode of payment you want for this course."
							: !isPublished && !price
							? "This course will be published for free as no price was set"
							: "Are you sure you want to unpublish this course?"}
					</AlertDialogDescription>
				</AlertDialogHeader>
				{!isPublished && price ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8">
							<FormField
								control={form.control}
								name="items"
								render={() => (
									<FormItem>
										{items.map((item) => (
											<FormField
												key={item.id}
												control={form.control}
												name="items"
												render={({ field }) => (
													<FormItem
														key={item.id}
														className="flex flex-row items-start space-x-3 space-y-0"
													>
														<FormControl>
															<Checkbox
																checked={field?.value?.includes(item.id)}
																disabled={
																	(item.id === "crypto" && !paymentWallet) ||
																	(item.id === "card" &&
																		!stripeOnboardingComplete) ||
																	!price
																}
																onCheckedChange={(checked) => {
																	return checked
																		? field.onChange([...field.value, item.id])
																		: field.onChange(
																				field.value?.filter(
																					(value) => value !== item.id
																				)
																		  );
																}}
															/>
														</FormControl>
														<FormLabel className="font-normal">
															{item.label}
														</FormLabel>
													</FormItem>
												)}
											/>
										))}
										<FormMessage />
									</FormItem>
								)}
							/>
							<AlertDialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button
									disabled={(!isValid && price) || isSubmitting}
									type="submit"
								>
									Publish
								</Button>
							</AlertDialogFooter>
							{/* <Button disabled={!isValid || isSubmitting} type="submit">
								Submit
							</Button> */}
						</form>
					</Form>
				) : !isPublished && !price ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onConfirm)} className="space-y-8">
							<AlertDialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button
									disabled={(!isValid && price) || isSubmitting}
									type="submit"
								>
									Publish
								</Button>
							</AlertDialogFooter>
						</form>
					</Form>
				) : (
					<AlertDialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button onClick={onConfirm}>Unpublish</Button>
					</AlertDialogFooter>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
};
