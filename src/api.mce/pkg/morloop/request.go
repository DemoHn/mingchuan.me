package morloop

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
)

// Request - general request type
type Request struct {
	// HttpRequest - http.Request source
	HttpRequest *http.Request
}

const (
	MIME_JSON         = "application/json"
	MIME_FORM_ENCODED = "application/x-www-form-urlencoded"
)

// GetParam - get param from router
// See Mux for more details
func (req *Request) GetParam(param string) string {
	params := mux.Vars(req.HttpRequest)
	if val, ok := params[param]; ok {
		return val
	}
	return ""
}

// GetQuery -
func (req *Request) GetQuery(key string) string {
	query := req.HttpRequest.URL.Query()
	val := query.Get(key)
	return val
}

// GetHeader -
func (req *Request) GetHeader(key string) string {
	header := req.HttpRequest.Header
	val := header.Get(key)
	return val
}

// GetMethod -
func (req *Request) GetMethod() string {
	return req.HttpRequest.Method
}

// GetPath -
func (req *Request) GetPath() string {
	return req.HttpRequest.URL.Path
}

// ParseBody - if input is a JSON string, then parse it
// to provided structure
func (req *Request) ParseBody(dest interface{}) error {
	body, _ := ioutil.ReadAll(req.HttpRequest.Body)
	return json.Unmarshal(body, dest)
}
