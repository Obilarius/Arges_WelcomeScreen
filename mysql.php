
<?php

if( isset($_POST['name'], $_POST['company']) ) {
  // $pdo = new PDO('mysql:host=localhost;dbname=test', 'username', 'password');
  try {
    $pdo = new PDO("sqlsrv:Server=dionysos;Database=Visitors", "WelcomeDisplay", "WelcomeDisplay");
  } catch (PDOException $e) {
      echo "Failed to get DB handle: " . $e->getMessage();
      exit;
  }

  $statement = $pdo->prepare("INSERT INTO tblVisitorsCheckIN (name, company, checkIn) OUTPUT Inserted.ID VALUES (?, ?, ?)");

  $name = $_POST['name'];
  $company = $_POST['company'];
  // if (isset($_POST['appointment'])) {
  //   $appointment = $_POST['appointment']
  // }
  //
  $return = $statement->execute(array( $name, $company, date('Y-m-d H:i:s')));

  echo $return;
}




?>
