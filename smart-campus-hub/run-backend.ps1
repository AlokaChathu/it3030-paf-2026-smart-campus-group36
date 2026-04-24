param(
    [int]$Port = 8090,
    [string]$MongoUri = "",
    [switch]$StopExisting = $true,
    [int]$PortSearchRange = 10
)

$ErrorActionPreference = "Stop"

function Get-ListeningPids([int]$TargetPort) {
    $lines = netstat -ano | Select-String ":$TargetPort"
    $result = @()

    foreach ($line in $lines) {
        $parts = ($line.ToString() -split "\s+") | Where-Object { $_ -ne "" }
        if ($parts.Count -ge 5 -and $parts[3] -eq "LISTENING") {
            $result += $parts[4]
        }
    }

    return ($result | Sort-Object -Unique)
}

function Get-FreePort([int]$StartPort, [int]$Range) {
    for ($candidate = $StartPort; $candidate -le ($StartPort + $Range); $candidate++) {
        $pids = Get-ListeningPids -TargetPort $candidate
        if (-not $pids -or $pids.Count -eq 0) {
            return $candidate
        }
    }
    return $null
}

function Ensure-MongoDbName([string]$Uri, [string]$DefaultDbName = "smart_campus") {
    if (-not $Uri -or $Uri.Trim().Length -eq 0) {
        return $Uri
    }

    $trimmed = $Uri.Trim()

    if ($trimmed -notmatch "^mongodb(\+srv)?:\/\/") {
        return $trimmed
    }

    # If URI already has path/db name (mongodb://host/db or mongodb+srv://host/db), keep it.
    if ($trimmed -match "^mongodb(\+srv)?:\/\/[^\/]+\/[^?\s]+") {
        return $trimmed
    }

    # Insert default DB name before query params when missing.
    if ($trimmed.Contains("?")) {
        $parts = $trimmed.Split("?", 2)
        $base = $parts[0].TrimEnd("/")
        return "$base/$DefaultDbName?$($parts[1])"
    }

    return "$($trimmed.TrimEnd('/'))/$DefaultDbName"
}

Write-Host "Starting smart-campus-hub on port $Port..." -ForegroundColor Cyan

if ($StopExisting) {
    $pids = Get-ListeningPids -TargetPort $Port

    foreach ($procId in $pids) {
        if ($procId -and $procId -ne "0") {
            Write-Host "Stopping process on port $Port (PID $procId)..." -ForegroundColor Yellow
            taskkill /PID $procId /F | Out-Null
        }
    }
}

$remainingPids = Get-ListeningPids -TargetPort $Port
if ($remainingPids -and $remainingPids.Count -gt 0) {
    $freePort = Get-FreePort -StartPort ($Port + 1) -Range $PortSearchRange
    if (-not $freePort) {
        throw "Port $Port is still busy and no free port found in range up to $($Port + $PortSearchRange)."
    }
    Write-Host "Port $Port is still busy. Falling back to port $freePort." -ForegroundColor Yellow
    $Port = $freePort
}

$env:SERVER_PORT = "$Port"

if ((-not $MongoUri -or $MongoUri.Trim().Length -eq 0) -and $env:SMART_CAMPUS_MONGODB_URI) {
    $MongoUri = $env:SMART_CAMPUS_MONGODB_URI
}

if (-not $MongoUri -or $MongoUri.Trim().Length -eq 0) {
    $frontendEnvPath = Join-Path $PSScriptRoot "..\frontend\.env"
    if (Test-Path $frontendEnvPath) {
        $envLines = Get-Content $frontendEnvPath -ErrorAction SilentlyContinue
        foreach ($rawLine in $envLines) {
            $line = $rawLine.Trim()
            if (-not $line -or $line.StartsWith("#")) {
                continue
            }

            if ($line.StartsWith("SMART_CAMPUS_MONGODB_URI=")) {
                $MongoUri = $line.Substring("SMART_CAMPUS_MONGODB_URI=".Length).Trim()
                break
            }
            if ($line.StartsWith("MONGODB_URI=")) {
                $MongoUri = $line.Substring("MONGODB_URI=".Length).Trim()
                break
            }
            if ($line -match "^mongodb(\+srv)?:\/\/") {
                $MongoUri = $line
                break
            }
        }

        if ($MongoUri -and $MongoUri.Trim().Length -gt 0) {
            Write-Host "Using Mongo URI detected from frontend .env." -ForegroundColor Green
        }
    }
}

if ($MongoUri -and $MongoUri.Trim().Length -gt 0) {
    $env:MONGODB_URI = Ensure-MongoDbName -Uri $MongoUri.Trim()
    Write-Host "Using custom Mongo URI from parameter." -ForegroundColor Green
}

Write-Host "Running Maven wrapper on port $Port..." -ForegroundColor Green
& .\mvnw.cmd spring-boot:run
