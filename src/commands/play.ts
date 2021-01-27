import { Command, flags } from '@oclif/command';
import { playVideo } from '../video/playVideo';

export default class Play extends Command {
  static description = 'describe the command here';

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [
    { name: 'videoId' }
  ]

  async run() {
    const { args, flags } = this.parse(Play);

    if (args.videoId == null) {
      throw new Error("No video id");
    }

    playVideo(args.videoId);
  }
}
