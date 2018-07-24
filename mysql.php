
<?php

if( isset($_POST['name'], $_POST['company']) ) {
  // $pdo = new PDO('mysql:host=localhost;dbname=test', 'username', 'password');
  try {
    $pdo = new PDO("sqlsrv:Server=dionysos;Database=Visitors", NULL, NULL);
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
  } catch (PDOException $e) {
      echo "Failed to get DB handle: " . $e->getMessage();
      exit;
  }

  $statement = $pdo->prepare("INSERT INTO tblVisitorsCheckIN (name, company, checkIn, appointmentID, location, Host) VALUES (:name, :company, :checkIn, :appid, :location, :host)");

  $name = $_POST['name'];
  $company = $_POST['company'];
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




?>
