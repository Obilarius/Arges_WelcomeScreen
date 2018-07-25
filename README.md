# Arges_WelcomeScreen

Es muss der MSSQL Treiber im __install Ordner installiert werden.  
Treiber in den php/ext Ordner installieren lassen (Entpackt die .dll Dateien)  

Einstellungen in php.ini  
    [PHP_MS_SQL_PDO]  
    extension=php_pdo_sqlsrv_72_nts_x86.dll  
    extension=php_pdo_sqlsrv_72_nts_x64.dll  

PHP 7.x  

**Einstellungen im Firefox** -> config:about  
Im Firefox muss der Labeldrucker als Standart gesetzt sein.  
print.always_print_silent = true  
