package morloop

import (
	"encoding/json"
	"net/http"
	"strconv"
)

// ResponseInfo - a third way to record response info
type ResponseInfo struct {
	StatusCode int
	Body       []byte
}

// Response -
type Response struct {
	ResponseWriter http.ResponseWriter
	// info
	Info *ResponseInfo
}

// JSON - write response data in JSON format
func (res *Response) JSON(data interface{}, err error) {
	// error
	if err != nil {
		res.writeError(err)
		return
	}
	res.writeSuccess(data)
}

func (res *Response) SetHeader(key string, value string) {
	w := res.ResponseWriter
	wHeader := w.Header()
	wHeader.Set(key, value)
}

// GetResponseCode - Notice: this is valid only
// after resposne data is written,
// If not, return ""
func (res *Response) GetResponseCode() string {
	if res.Info != nil {
		code := res.Info.StatusCode
		return strconv.Itoa(code)
	}
	return ""
}

// GetBody - get response body content
func (res *Response) GetBody() []byte {
	if res.Info != nil {
		return res.Info.Body
	}

	return nil
}

// GetBodyLength - get response body length (in bytes)
func (res *Response) GetBodyLength() int {
	if res.Info != nil {
		return len(res.Info.Body)
	}

	return 0
}

// internal functions
// writers - error & success
// constructErrorResponse - notice err not empty
func (res *Response) writeError(err error) {
	w := res.ResponseWriter
	if qErr, ok := err.(*Error); ok {
		j, _ := qErr.ToJSON()
		res.SetHeader("Content-Type", "application/json")
		w.WriteHeader(qErr.GetStatusCode())
		w.Write(j)

		// setup info
		res.Info = &ResponseInfo{
			StatusCode: qErr.GetStatusCode(),
			Body:       j,
		}
	} else {
		wrapErr := UnknownError(err)
		k, _ := wrapErr.ToJSON()

		wHeader := w.Header()
		wHeader.Set("Content-Type", "application/json")
		w.WriteHeader(wrapErr.GetStatusCode())
		w.Write(k)
		// construct info
		res.Info = &ResponseInfo{
			StatusCode: wrapErr.GetStatusCode(),
			Body:       k,
		}
	}
}

func (res *Response) writeSuccess(result interface{}) {
	w := res.ResponseWriter
	k, _ := json.Marshal(result)
	// write response header
	rHeader := w.Header()
	rHeader.Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)
	w.Write(k)

	// construct info
	res.Info = &ResponseInfo{
		StatusCode: http.StatusOK,
		Body:       k,
	}
}
