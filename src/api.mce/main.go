package main

import (
	"os"

	"github.com/urfave/cli"
	"mingchuan.me/app"
)

func main() {
	var err error
	// start App
	if err = parseArgs(os.Args, app.Start); err != nil {
		panic(err)
	}
}

func parseArgs(args []string, action func(*cli.Context) error) error {
	app := cli.NewApp()
	// init app properties
	app.Name = "mce"
	app.Usage = "main API of mingchuan.me"
	app.Version = "0.1.0"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "config, c",
			Value: "config.yml",
			Usage: "config file",
		},
	}

	app.Action = action
	return app.Run(args)
}
