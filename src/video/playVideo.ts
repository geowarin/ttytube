import execa = require("execa");

export async function playVideo(videoId: string, title?: string): Promise<execa.ExecaChildProcess> {
  try {

    const args = [
      `https://www.youtube.com/watch?v=${videoId}`,
      `--really-quiet`,
    ];
    if (title != null) {
      args.push(`--force-media-title="${title}"`)
    }

    // all_formats=<yes|no> add all youtube-dl formats (separate tracks) (default: no)
    // ytdl_path=youtube-dl
    // --ytdl-format=<ytdl|best|worst|mp4|webm|...>
    // --ytdl-raw-options=<key>=<value>[,<key>=<value>[,...]]

    return await execa('mpv', args);
  } catch (error) {
    throw new Error(`Error while playing video ${error}`)
  }
}
