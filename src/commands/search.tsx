import * as React from "react";
import { Command, flags } from '@oclif/command';
import { Box, render, Text } from 'ink';
import { search, SearchResult } from "../search/search";
import { readFileSync } from "fs";

export default class Search extends Command {
  static description = 'search for stuff on youtube';

  static flags = {
    mock: flags.boolean({description: "dev: read from file"}),
    dump: flags.boolean({description: "dump results to json"})
  }

  static args = [
    { name: 'search' }
  ];

  async run() {
    const { args, flags } = this.parse(Search);


    let results;
    if (flags.mock) {
      const file = readFileSync(`mock/${args.search}.json`);
      results = JSON.parse(file.toString()) as SearchResult[];
    } else {
      results = await search(args.search);
    }

    if (flags.dump) {
      this.log(JSON.stringify(results, null, 2));
    } else {
      render(<SearchScreen results={results} />);
    }
  }
}

interface SearchScreenProps {
  results: SearchResult[]
}

const SearchScreen: React.FunctionComponent<SearchScreenProps> = ({ results }) => {

  return (
    <Box flexDirection="column">
      { results.map(r => (
        <Box key={r.videoId}>
          <Box width="60%">
            <Text color="blue" wrap="truncate">{r.title}</Text>
          </Box>
          <Box width="20%">
            <Text color="magenta" wrap="truncate">{r.author}</Text>
          </Box>
          <Box width="10%">
            <Text color="green" wrap="truncate">{r.viewCount}</Text>
          </Box>
          <Box width="10%" alignSelf="flex-end">
            <Text color="blue" wrap="truncate">{r.length}</Text>
          </Box>
        </Box>
      ))
      }
    </Box>
  );
};
