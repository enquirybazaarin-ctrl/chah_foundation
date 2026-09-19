npx tsc
$process = Start-Process node -ArgumentList "dist/server.js" -PassThru
Start-Sleep -Seconds 2
Invoke-WebRequest -Uri http://localhost:3001/health | Select-Object -ExpandProperty Content
Stop-Process -Id $process.Id
