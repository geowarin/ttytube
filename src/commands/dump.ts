import {Command, flags} from '@oclif/command'
import {fetchYoutubeData, QueryType} from "../search/search";

function toQueryType(type: string): QueryType | undefined {
  switch (type) {
    case "all": return undefined;
    case "playlist": return QueryType.playlist;
    case "channel": return QueryType.channel;

    case "video":
    default:
      return QueryType.video;
  }
}


export default class Dump extends Command {
  static description = 'dump ytData json'

  static flags = {
    type: flags.string({default: "video", options: ["all", "video", "playlist", "channel"]})
  }

  static args = [{name: 'search'}]

  async run() {
    const {args, flags} = this.parse(Dump)

    const ytData = await fetchYoutubeData(args.search, toQueryType(flags.type));
    this.log(JSON.stringify(ytData, null, 2));
  }
}
