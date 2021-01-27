import * as React from "react";
import {Command, flags} from '@oclif/command';
import {Box, render, Text} from 'ink';
import {search, SearchResult} from "../search/search";
import {readFileSync} from "fs";

export default class Search extends Command {
  static description = 'search for stuff on youtube';

  static flags = {
    file: flags.string({description: "dev: read from file"}),
    json: flags.boolean({description: "dump results to json"})
  }

  static args = [
    {name: 'search'}
  ];

  async run() {
    const {args, flags} = this.parse(Search);

    let results;
    if (flags.file) {
      const file = readFileSync(flags.file);
      results = JSON.parse(file.toString()) as SearchResult[];
    } else {
      if (args.search == null) {
        throw new Error("No search query");
      }
      results = await search(args.search);
    }

    if (flags.json) {
      this.log(JSON.stringify(results, null, 2));
    } else {
      render(<SearchScreen results={results}/>);
    }
  }
}

interface SearchScreenProps {
  results: SearchResult[]
}
const SearchScreen: React.FunctionComponent<SearchScreenProps> = ({results}) => {
  return (
    <Box flexDirection="column">
      {results.map(r => (
        <Line key={r.videoId} searchResult={r}/>
      ))
      }
    </Box>
  );
};

interface LineProps {
  searchResult: SearchResult
}
const Line: React.FunctionComponent<LineProps> = (props) => {
  return (
    <Box>
      <Box width="60%">
        <Text color="blue" wrap="truncate">{props.searchResult.title}</Text>
      </Box>
      <Box width="20%">
        <Text color="magenta" wrap="truncate">{props.searchResult.author}</Text>
      </Box>
      <Box width="10%">
        <Text color="green" wrap="truncate">{props.searchResult.viewCount}</Text>
      </Box>
      <Box width="10%" alignSelf="flex-end">
        <Text color="blue" wrap="truncate">{props.searchResult.length}</Text>
      </Box>
    </Box>);
};
