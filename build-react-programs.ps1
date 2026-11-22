$ErrorActionPreference = 'Stop'
$root = Get-Location
$apps = @(
  @{ Dir = '10-React-HTML-Render'; Slug = '10-react-html-render'; Out = '../programs/10-react-html-render' },
  @{ Dir = '11-React-JSX'; Slug = '11-react-jsx'; Out = '../programs/11-react-jsx' },
  @{ Dir = '12-React-Nested-Components'; Slug = '12-react-nested-components'; Out = '../programs/12-react-nested-components' },
  @{ Dir = '13-React-State-Events'; Slug = '13-react-state-events'; Out = '../programs/13-react-state-events' },
  @{ Dir = '14-React-Forms-Events'; Slug = '14-react-forms-events'; Out = '../programs/14-react-forms-events' },
  @{ Dir = '15-React-Conditional-Rendering'; Slug = '15-react-conditional-rendering'; Out = '../programs/15-react-conditional-rendering' },
  @{ Dir = '16-React-Lists'; Slug = '16-react-lists'; Out = '../programs/16-react-lists' }
)

foreach ($app in $apps) {
  Write-Host "`n===== Building $($app.Slug) =====" -ForegroundColor Cyan
  Push-Location (Join-Path $root $app.Dir)
  try {
    # Reinstall dependencies so Windows receives the correct native Vite/Rolldown package.
    if (Test-Path 'node_modules') { Remove-Item 'node_modules' -Recurse -Force }
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed for $($app.Dir)" }
    npm run build -- --base="/programs/$($app.Slug)/" --outDir="$($app.Out)" --emptyOutDir
    if ($LASTEXITCODE -ne 0) { throw "Build failed for $($app.Dir)" }
  }
  finally { Pop-Location }
}
Write-Host "`nAll seven React demos built into the programs folder." -ForegroundColor Green
Write-Host 'Next: git add ., git commit, git push. Vercel will redeploy automatically.' -ForegroundColor Green
