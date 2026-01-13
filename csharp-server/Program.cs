using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:8000");
var app = builder.Build();

// Serve static files from the parent folder (project root) so index.html is reachable
var contentRoot = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), ".."));
app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = new PhysicalFileProvider(contentRoot) });
app.UseStaticFiles(new StaticFileOptions { FileProvider = new PhysicalFileProvider(contentRoot) });

app.Run();
