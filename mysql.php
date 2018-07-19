
<?php

if( isset($_POST['name'], $_POST['company']) ) {
  $pdo = new PDO('mysql:host=localhost;dbname=test', 'username', 'password');

  $statement = $pdo->prepare("INSERT INTO VisitorsManagement (name, company, appointmentBy, checkIn) VALUES (?, ?, ?, ?)");

  $name = $_POST['name'];
  $company = $_POST['company'];
  if (isset($_POST['appointment'])) {
    $appointment = $_POST['appointment']
  }

  $statement->execute(array( $name, $company, $appointment, date('Y-m-d H:i:s')));
}




?>
