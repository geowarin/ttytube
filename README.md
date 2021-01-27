ttytube
=======

CLI viewer for youtube

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ttytube.svg)](https://npmjs.org/package/ttytube)
[![CircleCI](https://circleci.com/gh/geowarin/ttytube/tree/master.svg?style=shield)](https://circleci.com/gh/geowarin/ttytube/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/ttytube.svg)](https://npmjs.org/package/ttytube)
[![License](https://img.shields.io/npm/l/ttytube.svg)](https://github.com/geowarin/ttytube/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ttytube
$ ttytube COMMAND
running command...
$ ttytube (-v|--version|version)
ttytube/0.0.0 linux-x64 node-v15.6.0
$ ttytube --help [COMMAND]
USAGE
  $ ttytube COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ttytube hello [FILE]`](#ttytube-hello-file)
* [`ttytube help [COMMAND]`](#ttytube-help-command)
* [`ttytube play [FILE]`](#ttytube-play-file)
* [`ttytube search [SEARCH]`](#ttytube-search-search)

## `ttytube hello [FILE]`

describe the command here

```
USAGE
  $ ttytube hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ ttytube hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/geowarin/ttytube/blob/v0.0.0/src/commands/hello.ts)_

## `ttytube help [COMMAND]`

display help for ttytube

```
USAGE
  $ ttytube help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `ttytube play [FILE]`

describe the command here

```
USAGE
  $ ttytube play [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/play.ts](https://github.com/geowarin/ttytube/blob/v0.0.0/src/commands/play.ts)_

## `ttytube search [SEARCH]`

search for stuff on youtube

```
USAGE
  $ ttytube search [SEARCH]

OPTIONS
  --file=file  dev: read from file
  --json       dump results to json
```
<!-- commandsstop -->
