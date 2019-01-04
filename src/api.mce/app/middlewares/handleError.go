package middlewares

import (
	"net/http"

	"mingchuan.me/app/errors"
)

// HandleError -
func HandleError(w http.ResponseWriter, r *http.Request, err *errors.Error) {
	jErr, _ := err.ToJSON()
	wHeader := w.Header()
	wHeader.Set("Content-Type", "application/json")
	w.WriteHeader(err.GetStatusCode())

	w.Write(jErr)
}
