
@echo off
if not exist "./.asterjs" mkdir "./.asterjs"
cd > "./.asterjs/.codeFolder.txt"
echo %1 >> "./.asterjs/.codeFolder.txt"
@rem deno run --unstable --allow-run --allow-read="." --allow-write="." "./src/index.deno.ts"
