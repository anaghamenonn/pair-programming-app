import re

def last_token(before: str) -> str:
    if not before:
        return ""
    toks = re.split(r'(\s+|[\(\)\[\]\:\,\.])', before)
    for t in reversed(toks):
        if t and not t.isspace():
            return t
    return ""

def generate_suggestion(code: str, cursor: int) -> str:
    before = code[:cursor]
    token = last_token(before)
    last_line = before.splitlines()[-1].strip() if before.splitlines() else ""

    suggestion = ""

    if before.rstrip().endswith("def"):
        suggestion = " function_name(params):\n    '''Describe function'''\n    pass"
    elif before.rstrip().endswith("class"):
        suggestion = " ClassName(BaseClass):\n    def __init__(self, ...):\n        super().__init__()"
    elif token == "for":
        suggestion = " i in range(n):\n    pass"
    elif token == "while":
        suggestion = " condition:\n    pass"
    elif token in ("if", "elif"):
        suggestion = " condition:\n    pass"
    elif token == "else":
        suggestion = ":\n    pass"
    elif token == "try":
        suggestion = ":\n    # try block\nexcept Exception as e:\n    # handle"
    elif token == "import":
        suggestion = " os"
    elif token.endswith("from"):
        suggestion = " typing import List"
    elif token.startswith("@"):
        suggestion = "staticmethod"
    elif token == "return":
        suggestion = " value"
    elif token == "print":
        suggestion = '("message")'
    elif last_line.startswith("#"):
        suggestion = " TODO: implement logic"
    else:
        suggestion = "# suggestion: try writing something"

    return suggestion[:400]
