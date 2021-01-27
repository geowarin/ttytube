import * as React from "react";
import {Command, flags} from '@oclif/command';
import {Box, render, Text, useApp, useInput} from 'ink';
import {search, SearchResult} from "../search/search";
import {readFileSync} from "fs";
import {playVideo} from "../video/playVideo";
import {strip, replace} from "clean-text-utils";

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
  const {exit} = useApp();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useInput((input, key) => {
    if (input == "q") {
      exit()
    }
    if (key.upArrow) {
      setSelectedIndex(index => index == 0 ? 19 : index - 1);
    }
    if (key.downArrow) {
      setSelectedIndex(index => (index + 1) % 20);
    }
    if (key.return) {
      const selectedResult = results[selectedIndex];
      playVideo(selectedResult.videoId);
    }

  })

  return (
    <Box flexDirection="column">
      {
        results.map((searchResult, index) => (
          <Line key={searchResult.videoId} searchResult={searchResult} selected={selectedIndex == index}/>
        ))
      }
    </Box>
  );
};

interface LineProps {
  searchResult: SearchResult,
  selected: boolean
}

const Line: React.FunctionComponent<LineProps> = ({searchResult, selected}) => {
  const color = selected ? "white" : "blue";
  return (
    <Box>
      <Box width="60%">
        <Text color={color} wrap="truncate">{strip.emoji(searchResult.title)}</Text>
      </Box>
      <Box width="20%">
        <Text color="magenta" wrap="truncate">{searchResult.shortByline}</Text>
      </Box>
      <Box width="10%">
        <Text color="green" wrap="truncate">{searchResult.viewCount}</Text>
      </Box>
      <Box width="10%" alignSelf="flex-end">
        <Text color="blue" wrap="truncate">{searchResult.length}</Text>
      </Box>
    </Box>);
};
