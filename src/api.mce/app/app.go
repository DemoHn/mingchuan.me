package app

import (
	"log"
	"os"

	"mingchuan.me/app/drivers/gorm"

	"mingchuan.me/app/drivers/swagger"
	"mingchuan.me/app/middlewares"
	"mingchuan.me/app/providers/account"
	"mingchuan.me/app/providers/blog"
	"mingchuan.me/app/providers/healthz"
	"mingchuan.me/app/providers/todo"
	"mingchuan.me/infra"

	"github.com/urfave/cli"

	// FixMe
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

// App - Instance
type App struct {
	CLI       *cli.Context
	apiServer *swagger.Driver
}

// New - new App instance
func New(c *cli.Context) *App {
	return &App{
		CLI: c,
	}
}

// setters

// Init - init services
func (app *App) Init() error {
	var err error

	debugMode := (os.Getenv("DEBUG") == "1")
	configPath := app.CLI.String("config")
	// 01. init infra
	infra := infra.New(configPath, debugMode)

	// 02. init db
	db, err := gorm.NewDriver(infra)
	if err != nil {
		return err
	}
	// 03. init apiServer - swagger
	var api *swagger.Driver
	if api, err = swagger.NewDriver(infra); err != nil {
		return err
	}
	app.apiServer = api

	// 04. register middlewares
	api.Use(middlewares.Auth)
	api.SetErrorHandler(middlewares.HandleError)

	// 05. account module
	_, err = account.New(infra, db, api)
	if err != nil {
		return err
	}

	// 06. blog module
	_, err = blog.New(infra, db, api)
	if err != nil {
		return err
	}

	// 07. todo module
	_, err = todo.New(infra, db, api)
	if err != nil {
		return err
	}

	// 08. health module
	_, err = healthz.New(infra, db, api)
	return err
}

// Start - start the whole instance
// Normally the program will hang util receiving stop signal
// @returns - stop signal ID
func Start(context *cli.Context) error {
	app := New(context)
	if err := app.Init(); err != nil {
		return err
	}

	app.apiServer.Listen()
	log.Println("mingchuan.me API is on!")

	return nil
}
