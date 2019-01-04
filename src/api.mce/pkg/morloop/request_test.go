package morloop

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
	"net/http"
	"net/http/httptest"
	"testing"
)

func createReq(req *http.Request) *Request {
	return &Request{
		HttpRequest: req,
	}
}
func Test_RequestQuery(t *testing.T) {
	// generate mock request
	mockReqs := []*http.Request{
		// normal
		httptest.NewRequest("GET", "https://mock.com/a/b?first=1&second=2", nil),
		// empty and encoded chars
		httptest.NewRequest("POST", "https://mock.com/a/b?empty=&asd=%20FG", nil),
		// number
		httptest.NewRequest("GET", "https://mock.com?12=23", nil),
		//
	}

	mockParams := [][]string{
		[]string{"first", "second"},
		[]string{"empty", "asd"},
		[]string{"12"},
	}

	mockExpectedAnswers := [][]string{
		[]string{"1", "2"},
		[]string{"", " FG"},
		[]string{"23"},
	}

	for i, mockReq := range mockReqs {
		for j, mockQuery := range mockParams[i] {
			answer := createReq(mockReq).GetQuery(mockQuery)
			// assert
			assert.Equal(t, answer, mockExpectedAnswers[i][j])
		}
	}
}

func Test_RequestParam(t *testing.T) {
	mockReq := httptest.NewRequest("GET", "https://mock.com", nil)
	// with mock Param from gorilla/mux
	mockReq = mux.SetURLVars(mockReq, map[string]string{
		"param1": "param2",
	})

	assert.Equal(t, createReq(mockReq).GetParam("param1"), "param2")

	// set-up new route
	r := mux.NewRouter()

	r.HandleFunc("/api/{user}", func(w http.ResponseWriter, req *http.Request) {
		mReq := createReq(req)
		assert.Equal(t, mReq.GetParam("user"), "uuid")
	})

	server := httptest.NewServer(r)
	defer server.Close()

	_, err := http.Get(fmt.Sprintf("%s/api/uuid", server.URL))
	assert.Nil(t, err)
}

func Test_RequestHeader(t *testing.T) {
	mockReq := httptest.NewRequest("GET", "https://mock.com", nil)
	// mock header data
	mockReq.Header.Set("Encoding", "utf8")
	mockReq.Header.Set("h-j", "hello")
	mockReq.Header.Set("PIG-pot", "pot")
	mockReq.Header.Set("HK01", "pot2")

	mockReqKey := []string{
		"encoding",
		"h-j",
		"pig-pot",
		"Hk01",
	}
	mockExpectedAnswers := []string{
		"utf8",
		"hello",
		"pot",
		"pot2",
	}

	newReq := createReq(mockReq)
	for i, key := range mockReqKey {
		assert.Equal(t, mockExpectedAnswers[i], newReq.GetHeader(key))
	}
}

func Test_RequestMethodAndPath(t *testing.T) {
	mockReqs := []*http.Request{
		httptest.NewRequest("GET", "https://root.com/", nil),
		httptest.NewRequest("POST", "http://a.com/f_q/sr/", nil),
		httptest.NewRequest("POST", "http://a.com/f_q/sr", nil),
		httptest.NewRequest("DELETE", "http://a.com////", nil),
		httptest.NewRequest("CUSTOM", "http://a.com////custom", nil),
	}

	mockExpectedMethods := []string{
		"GET",
		"POST",
		"POST",
		"DELETE",
		"CUSTOM",
	}

	mockExpectedPaths := []string{
		"/",
		"/f_q/sr/",
		"/f_q/sr",
		"////",
		"////custom",
	}

	for i, req := range mockReqs {
		r := createReq(req)

		assert.Equal(t, r.GetMethod(), mockExpectedMethods[i])
		assert.Equal(t, r.GetPath(), mockExpectedPaths[i])
	}
}

func Test_RequestBody(t *testing.T) {

}
