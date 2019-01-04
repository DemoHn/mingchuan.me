package cmdspliter

const (
	TK_NUL  uint8 = 0 // null char (or trx'er)
	TK_CHAR uint8 = 1 // normal char
	TK_SPX  uint8 = 2 // space (separator)
	TK_SQ   uint8 = 3 // single quote
	TK_DQ   uint8 = 4 // double quote
)

// SplitCommand - separate a string command to progarm and args
func SplitCommand(command string) (program string, args []string) {
	// round 1: handle trx chars
	tks := make([]uint8, 0)
	cursor := TK_CHAR
	for _, r := range command {
		if cursor == TK_NUL {
			cursor = TK_CHAR
		} else {
			switch r {
			case '\\':
				cursor = TK_NUL
				break
			case '\'':
				cursor = TK_SQ
				break
			case '"':
				cursor = TK_DQ
				break
			case ' ':
				cursor = TK_SPX
				break
			default:
				cursor = TK_CHAR
				break
			}
		}

		tks = append(tks, cursor)
	}

	// round 2: handle tokens
	finalArgs := make([]string, 0)
	quoteFlag := TK_NUL
	enterFlag := false

	argStr := make([]rune, 0)
	for i, tk := range tks {
		// change flag status
		switch tk {
		case TK_DQ, TK_SQ:
			if quoteFlag == tk {
				quoteFlag = TK_NUL
			} else if quoteFlag == TK_NUL {
				quoteFlag = tk
			} else {
				argStr = append(argStr, []rune(command)[i])
			}
		case TK_SPX:
			if quoteFlag == TK_NUL {
				enterFlag = true
			} else {
				argStr = append(argStr, []rune(command)[i])
			}
		case TK_CHAR:
			argStr = append(argStr, []rune(command)[i])
		}

		// append string to args
		if enterFlag == true {
			enterFlag = false
			// clear argStr
			if len(argStr) > 0 {
				finalArgs = append(finalArgs, string(argStr))
			}
			argStr = argStr[:0]
		}

	}
	// insert final argument
	if len(argStr) > 0 {
		finalArgs = append(finalArgs, string(argStr))
	}

	// export data
	if len(finalArgs) > 0 {
		program = finalArgs[0]
	} else {
		program = ""
	}

	if len(finalArgs) > 1 {
		args = finalArgs[1:]
	} else {
		args = []string{}
	}

	return
}
