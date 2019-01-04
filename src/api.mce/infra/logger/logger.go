package logger

import (
	logrus "github.com/sirupsen/logrus"
)

// Logger - alias of logrus.Logger
type Logger = logrus.Logger

var gLogger *Logger
var gDebugMode bool

// Init - init an instance
func Init(debugMode bool) *Logger {
	// if not inited
	logger := logrus.New()

	logger.SetFormatter(&logrus.TextFormatter{
		FullTimestamp:          true,
		DisableLevelTruncation: true,
		// <date>/<month>/<year> <Hour>:<minute>:<second>.<ms> <tz>
		TimestampFormat: "02/01/2006 15:04:05.999 MST",
	})
	if debugMode {
		logger.SetLevel(logrus.DebugLevel)
	} else {
		logger.SetLevel(logrus.InfoLevel)
	}
	gLogger = logger
	gDebugMode = debugMode
	return logger
}

// Get - get global instnace of logrus logger
func Get() *Logger {
	return gLogger
}

// DebugMode - get if in debug mode
func DebugMode() bool {
	return gDebugMode
}
