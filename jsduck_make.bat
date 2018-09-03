rd /s /Q "%~dp0docmade"
%~dp0tool/jsduck-5.3.4.exe --output="%~dp0docmade" --images="%~dp0src/img" --config="%~dp0zhtml5info_doc.json" "%~dp0src/js"
pause
