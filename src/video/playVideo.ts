import execa = require("execa");

export async function playVideo(videoId: string, title: string) {
	try {

		var args = [
			`--really-quiet`,
			`--force-media-title="${title}"`,
			`https://www.youtube.com/watch?v=${videoId}`
		];

		const stdout = await execa('mpv', args);
		console.log(stdout);
	} catch (error) {
		throw new Error(`Error while playing video ${error}`)
	}
};
