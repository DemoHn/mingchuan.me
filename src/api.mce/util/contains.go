package util

// Contains - if one string item is contained in a string array
func Contains(arr []string, item string) bool {
	for _, a := range arr {
		if a == item {
			return true
		}
	}

	return false
}
