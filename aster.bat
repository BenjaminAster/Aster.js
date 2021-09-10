
@echo off
if not exist "./.asterjs" mkdir "./.asterjs"
echo %1 > "./.asterjs/.codeFolder.txt"
deno run --unstable --allow-run --allow-read="." --allow-write="." "./src/index.deno.ts"
