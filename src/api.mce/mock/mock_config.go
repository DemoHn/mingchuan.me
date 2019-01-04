// Code generated by MockGen. DO NOT EDIT.
// Source: mingchuan.me/infra/config (interfaces: IConfig)

// Package mock is a generated GoMock package.
package mock

import (
	gomock "github.com/golang/mock/gomock"
	reflect "reflect"
)

// MockIConfig is a mock of IConfig interface
type MockIConfig struct {
	ctrl     *gomock.Controller
	recorder *MockIConfigMockRecorder
}

// MockIConfigMockRecorder is the mock recorder for MockIConfig
type MockIConfigMockRecorder struct {
	mock *MockIConfig
}

// NewMockIConfig creates a new mock instance
func NewMockIConfig(ctrl *gomock.Controller) *MockIConfig {
	mock := &MockIConfig{ctrl: ctrl}
	mock.recorder = &MockIConfigMockRecorder{mock}
	return mock
}

// EXPECT returns an object that allows the caller to indicate expected use
func (m *MockIConfig) EXPECT() *MockIConfigMockRecorder {
	return m.recorder
}

// Find mocks base method
func (m *MockIConfig) Find(arg0 string) (interface{}, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Find", arg0)
	ret0, _ := ret[0].(interface{})
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// Find indicates an expected call of Find
func (mr *MockIConfigMockRecorder) Find(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Find", reflect.TypeOf((*MockIConfig)(nil).Find), arg0)
}

// FindInt mocks base method
func (m *MockIConfig) FindInt(arg0 string) (int, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindInt", arg0)
	ret0, _ := ret[0].(int)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindInt indicates an expected call of FindInt
func (mr *MockIConfigMockRecorder) FindInt(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindInt", reflect.TypeOf((*MockIConfig)(nil).FindInt), arg0)
}

// FindString mocks base method
func (m *MockIConfig) FindString(arg0 string) (string, error) {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "FindString", arg0)
	ret0, _ := ret[0].(string)
	ret1, _ := ret[1].(error)
	return ret0, ret1
}

// FindString indicates an expected call of FindString
func (mr *MockIConfigMockRecorder) FindString(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "FindString", reflect.TypeOf((*MockIConfig)(nil).FindString), arg0)
}

// Load mocks base method
func (m *MockIConfig) Load(arg0 string) error {
	m.ctrl.T.Helper()
	ret := m.ctrl.Call(m, "Load", arg0)
	ret0, _ := ret[0].(error)
	return ret0
}

// Load indicates an expected call of Load
func (mr *MockIConfigMockRecorder) Load(arg0 interface{}) *gomock.Call {
	mr.mock.ctrl.T.Helper()
	return mr.mock.ctrl.RecordCallWithMethodType(mr.mock, "Load", reflect.TypeOf((*MockIConfig)(nil).Load), arg0)
}
