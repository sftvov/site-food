<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/PHPMailer.php';
  require 'phpmailer/src/SMTP.php';



  $mail = new PHPMailer(true);
  $mail->CharSet = 'UTF-8';

  $mail->isSMTP();
  $mail->Host = 'smtp.mail.ru';
  $mail->SMTPAuth = true;
  $mail->Username = 'v-kochnev@internet.ru';
  $mail->Password = 'dh2pKVKLXmafpSMKMGEw';
  $mail->SMTPSecure = 'ssl';
  $mail->Port = 465;  

  $mail->IsHTML(true);
  $mail->setLanguage('ru', 'phpmailer/language/');

  $body = '<h1>Новая отправка формы с сайта DENT</h1>';

  
  $name = $_POST['formName'];
  $tel = $_POST['formTel'];
  $mesName = $_POST["formPopupNameMassage"];
  $mesTel = $_POST["formPopupTelMassage"];
  $mesText = $_POST["formPopupTextMassage"];
    

  if ($name) {
    $mail->Subject = 'Запись на бесплатную консультацию';
    $body = '<h1>Запись на консультацию</h1><p>Имя: '.$name.'</p><p>Телефон: '.$tel.'</p>';
  } else if ($mesName) {
    $mail->Subject = 'Новое сообщение с сайта';
    $body = '<h1>Новое сообщение</h1><p>Имя: '.$mesName.'</p><p>Телефон: '.$mesTel.'</p><p>Сообщение: '.$mesText.'</p>';
  }

  $mail->Body = $body;

  $mail->setFrom('v-kochnev@internet.ru');
  $mail->addAddress('2008vovchik@mail.ru'); 

if (!$mail->Send()){
  $message = 'Ошибка';
} else {
  $message = 'Данные отправлены';
}

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);

?>