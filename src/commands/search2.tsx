import * as React from "react";
import {Command, flags} from '@oclif/command';
import {Box, render, Text, useApp, useInput} from 'ink';
import * as ytSearch from "ytsr";

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


    if (args.search == null) {
      throw new Error("No search query");
    }
    const results: ytSearch.Result = await ytSearch(args.search, {limit: 20});


    if (flags.json) {
      this.log(JSON.stringify(results, null, 2));
    } else {
      render(<SearchScreen results={results.items}/>);
    }
  }
}

interface SearchScreenProps {
  results: ytSearch.Item[]
}

const SearchScreen: React.FC<SearchScreenProps> = ({results}) => {
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
      // playVideo(selectedResult.videoId);
    }

  })

  return (
    <Box flexDirection="column">
      {
        results.map((searchResult, index) => {
          const selected = selectedIndex == index;
          const color = selected ? "white" : "blue";

          return (
            <Box key={index}>
              <Box width="60%">
                <Text color={color}>{searchResult.type}</Text>
              </Box>
            </Box>
          );
        })
      }
    </Box>
  );
};

