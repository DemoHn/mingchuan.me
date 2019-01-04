package morloop_test

import (
	"fmt"
	"github.com/stretchr/testify/assert"
	"io/ioutil"
	"mingchuan.me/pkg/morloop"
	"net/http/httptest"
	"testing"
)

type mResponse = morloop.Response

type ExampleData struct {
	Age        int32  `json:"age"`
	Name       string `json:"name"`
	Occupation string `json:"occupation"`
}

func createResp() *mResponse {
	return &mResponse{
		ResponseWriter: httptest.NewRecorder(),
		Info:           nil,
	}
}

// test if res.JSON() succeeded
func Test_ResponseJSON_Success(t *testing.T) {
	resp := createResp()

	resp.JSON(ExampleData{
		Age:        23,
		Name:       "Jason",
		Occupation: "MSE",
	}, nil)

	// 01. test raw response
	rWriter, ok := resp.ResponseWriter.(*httptest.ResponseRecorder)
	assert.Equal(t, ok, true)

	rResp := rWriter.Result()
	body, _ := ioutil.ReadAll(rResp.Body)
	// check body
	assert.Equal(t, body, []byte("{\"age\":23,\"name\":\"Jason\",\"occupation\":\"MSE\"}"))
	assert.Equal(t, body, resp.GetBody())
	assert.Equal(t, len(body), resp.GetBodyLength())

	// check response code
	assert.Equal(t, rResp.StatusCode, 200)
	assert.Equal(t, resp.GetResponseCode(), "200")

	// check header
	assert.Equal(t, rResp.Header["Content-Type"], []string{"application/json"})
}

func Test_ResponseJSON_KnownError(t *testing.T) {
	resp := createResp()

	resp.JSON(nil, morloop.ResourceNotFoundError("A", "B"))
	// 01. test raw response
	rWriter, ok := resp.ResponseWriter.(*httptest.ResponseRecorder)
	assert.Equal(t, ok, true)

	rResp := rWriter.Result()
	body, _ := ioutil.ReadAll(rResp.Body)
	// check body
	assert.Equal(t, body, resp.GetBody())
	assert.Equal(t, len(body), resp.GetBodyLength())

	// check response code
	assert.Equal(t, rResp.StatusCode, 404)
	assert.Equal(t, resp.GetResponseCode(), "404")

	// check header
	assert.Equal(t, rResp.Header["Content-Type"], []string{"application/json"})
}

func Test_ResponseJSON_UnknownError(t *testing.T) {
	resp := createResp()

	resp.JSON(nil, fmt.Errorf("Unknown Error"))
	// 01. test raw response
	rWriter, ok := resp.ResponseWriter.(*httptest.ResponseRecorder)
	assert.Equal(t, ok, true)

	rResp := rWriter.Result()
	body, _ := ioutil.ReadAll(rResp.Body)
	// check body
	assert.Equal(t, body, resp.GetBody())
	assert.Equal(t, len(body), resp.GetBodyLength())

	// check response code
	assert.Equal(t, rResp.StatusCode, 500)
	assert.Equal(t, resp.GetResponseCode(), "500")

	// check header
	assert.Equal(t, rResp.Header["Content-Type"], []string{"application/json"})
}
