
<?php

// CHECKIN
if( isset($_POST['name'], $_POST['company']) ) {
  echo "was?!";
  try {
    $pdo = new PDO("sqlsrv:Server=dionysos;Database=Visitors", NULL, NULL);
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
  } catch (PDOException $e) {
      writeLog("Failed to get DB handle: " . $e->getMessage());
      exit;
  }

  $statement = $pdo->prepare("INSERT INTO tblVisitorsCheckIN (name, company, checkIn, appointmentID, location, Host) VALUES (:name, :company, :checkIn, :appid, :location, :host)");

  $appid = ( isset($_POST['appid']) and $_POST['appid'] != "" ) ? $_POST['appid'] : NULL ;
  $location = ( isset($_POST['location']) and $_POST['location'] != "" ) ? $_POST['location'] : NULL ;
  $host = ( isset($_POST['host']) and $_POST['host'] != "" ) ? $_POST['host'] : NULL ;

  $statement->bindValue(":name", $name);
  $statement->bindValue(":company", $company);
  $statement->bindValue(":appid", $appid);
  $statement->bindValue(":location", $location);
  $statement->bindValue(":host", $host);
  $statement->bindValue(":checkIn", date('Y-m-d\TH:i:s'));

  $statement->execute();
  $lastID = $pdo->lastInsertId();

  echo $lastID;
}


// CHECKOUT
if (isset($_POST['visitorid'])) {
  try {
    $pdo = new PDO("sqlsrv:Server=dionysos;Database=Visitors", NULL, NULL);
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
  } catch (PDOException $e) {
      writeLog("Failed to get DB handle: " . $e->getMessage());
      exit;
  }

  $statement = $pdo->prepare("UPDATE tblVisitorsCheckIN SET checkOUT = :checkOut WHERE ID = :id AND checkOUT IS NULL");

  $statement->bindValue(":id", $_POST['visitorid']);
  $statement->bindValue(":checkOut", date('Y-m-d\TH:i:s'));

  $statement->execute();
  $no = $statement->rowCount();

  // gibt Anzahl bearbeiteter Zeilen zurück (0 = ist bereits ausgeloggt, 1 = wurde erfolgreich ausgeloggt)
  echo $no;
}


function writeLog ($data) {
  $format = "csv"; //Moeglichkeiten: csv und txt

  $datum_zeit = date("Y/m/d H:i:s");

  $monate = array(1=>"Januar", 2=>"Februar", 3=>"Maerz", 4=>"April", 5=>"Mai", 6=>"Juni", 7=>"Juli", 8=>"August", 9=>"September", 10=>"Oktober", 11=>"November", 12=>"Dezember");
  $monat = date("n");
  $jahr = date("y");
  $jahrLang = date("Y");

  $dateiname="logs/log_". $jahrLang ."_" . $monate[$monat] . "." . $format;

  $header = array("Datum", "Daten");
  $infos = array($datum_zeit, $data);

  if($format == "csv") {
   $eintrag= '"'.implode('", "', $infos).'"';
  } else {
   $eintrag = implode("\t", $infos);
  }

  $write_header = !file_exists($dateiname);

  $datei=fopen($dateiname,"a");

  if($write_header) {
   if($format == "csv") {
   $header_line = '"'.implode('", "', $header).'"';
   } else {
   $header_line = implode("\t", $header);
   }

   fputs($datei, $header_line."\n");
  }

  fputs($datei,$eintrag."\n");
  fclose($datei);
}




?>
