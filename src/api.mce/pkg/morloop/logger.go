package morloop

import "log"

type Logger struct {
}

// Info - log info
func (logger *Logger) Info(content string) {
	log.Printf(content)
}

// Error - log error
func (logger *Logger) Error(content string) {
	log.Printf(content)
}

func (logger *Logger) Debug(content string) {
	log.Printf(content)
}
