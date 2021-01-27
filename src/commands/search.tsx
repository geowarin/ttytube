import * as React from "react";
import {Command, flags} from '@oclif/command'
import { Box, render, Text } from 'ink';

export default class Search extends Command {
  static description = 'search for stuff on youtube'

  static flags = {
  }

  static args = [{name: 'search'}]

  async run() {
    const {args, flags} = this.parse(Search);

    //this.log(`search ${args.search}`);
    render(<SearchScreen name={args.search} />);
  }
}

interface Props {
  name: string
}

const SearchScreen: React.FunctionComponent<Props> = ({name}) => {

	return (
    <Box>
      <Text>{name}</Text>
    </Box>
  );
};
