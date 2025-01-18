"use client";

import { useQuery } from "@tanstack/react-query";

import { APIVersion1GetCurrentUser } from "@/http";

export default function Live() {

	const { data, isLoading, isError } = useQuery({
		queryKey: ["events"],
		queryFn: APIVersion1GetCurrentUser,
	})

	return (
		<>
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold mb-6">Hello {data && data.data.name || "there"} 👋,</h1>

				<h2 className="text-2xl font-semibold mb-4">Here are the latest Hacker News stories</h2>

				<div className="bg-gray-100 border-l-4 border-black p-4 rounded" role="alert">
					<p className="font-bold">Recent Activity</p>
					<p>The number of stories posted in the last 5 mins is 0</p>
				</div>
			</div>
		</>
	);
}
