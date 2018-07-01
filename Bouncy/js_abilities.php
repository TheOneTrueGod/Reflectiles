<?
header("Content-type: text/javascript");
foreach (glob('/path/to/files/*.js') as $file)
{
    readfile($file);
}
