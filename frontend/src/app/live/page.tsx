"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import io, { Socket } from "socket.io-client";
import { useQuery } from "@tanstack/react-query";

import { CONFIGS } from "@/configs";
import { getCookie } from "cookies-next";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"
import { refreshAuthTokenLogic } from "@/http/xhr";
import { APIVersion1GetCurrentUser } from "@/http";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export default function Live() {
	const [stories, setStories] = React.useState<HackerNewsStory[]>([]);
	const [storiesInLast5MinsCount, setStoriesInLast5MinsCount] = React.useState(0);

	const socketInitializer = React.useCallback(async () => {
		await refreshAuthTokenLogic();
		return io(CONFIGS.URL.SOCKET_URL, {
			auth: {
				authorization: `Bearer ${getCookie(CONFIGS.AUTH.ACCESS_TOKEN_NAME)}`,
			},
		});
	}, []);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["events"],
		queryFn: APIVersion1GetCurrentUser,
	})

	const [socket, setSocket] = React.useState<Socket | null>(null);

	React.useEffect(() => {
		socketInitializer().then((socket) => {
			setSocket(socket);
		});
	}, [socketInitializer]);


	React.useEffect(() => {
		if (!socket) return;

		socket.on("connect", () => {
			console.log("::> Socket connected");
		});

		socket.on("connected", (payload) => {
			console.log("::> Socket connected", payload);

			setStoriesInLast5MinsCount(payload.stories_in_last_5_mins_count);
		});

		socket.on("top_3_latest_stories", (payload) => {
			console.log("::> Top 3 latest stories", payload);

			setStories(payload);
		});

		socket.on("connect_error", function (error) {
			console.log("::> Socket connection error");
			console.log(error);
			console.log(error.message);
		});

		socket.on("error", function (error) {
			console.log("::> Socket error");
			console.log(error);
			console.log(error.msg);
		});

		return () => {
			console.log("::> Socket disconnected");
			socket.disconnect();
		};
	}, [socket]);

	return (
		<>
			<div className="container mx-auto p-4">
				<h1 className="text-3xl font-bold mb-6">Hello {data && data.data.name || "there"} 👋,</h1>

				<h2 className="text-2xl font-semibold mb-4">Here are the latest Hacker News stories</h2>

				{stories.length === 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
						<Skeleton className="h-[200px] w-full" />
						<Skeleton className="h-[200px] w-full" />
						<Skeleton className="h-[200px] w-full" />
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
					{stories.length > 0 && stories.map(story => (
						<Card key={story.id} className="flex flex-col transition-shadow hover:shadow-lg">
							<CardHeader>
								<CardTitle className="text-lg">{story.title}</CardTitle>
							</CardHeader>
							<CardContent className="flex-grow">
								<p className="text-sm text-gray-600 mb-2">By {story.author}</p>
								<p className="text-sm text-gray-600">{formatDate(story.created_at)}</p>
							</CardContent>
							<CardFooter className="flex justify-between items-center">
								<span className="text-sm font-semibold">{story.points} points</span>
								{story.url && (
									<a href={story.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:text-blue-700">
										<ExternalLink size={16} className="mr-1" />
										Read More
									</a>
								)}
							</CardFooter>
						</Card>
					))}
				</div>

				<div className="bg-gray-100 border-l-4 border-black p-4 rounded" role="alert">
					<p className="font-bold">Recent Activity</p>
					<p>The number of stories posted in the last 5 mins is {storiesInLast5MinsCount}</p>
				</div>
			</div>
		</>
	);
}
