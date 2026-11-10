param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Message
)

$commitMsg = $Message -join " "
if ($commitMsg -ne "") {
    node scripts/ship.cjs "$commitMsg"
} else {
    node scripts/ship.cjs
}
