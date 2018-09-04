<?php 
header("Access-Control-Allow-Origin: *");
 include("base/config/DB_config.php");
 include("base/includes/class_file.php");
 include("base/includes/SendingSMS.php");
    $data  = "";
  


 $wallet_num  = $_POST['wallet_number'];
   $merchantcode  = $_POST['merchantcode'];
 


	//  $wallet_num = "0803846845641370";
	  //  $merchantcode = "41370";
  $dateformating =     date('m/d/Y H:i:s'); 	  
 $registeredby = "";
$datetime=  date('Y-m-d G:i:s'); 

$kwH = "";
$fetsreceipt = "";
$fetsreceipt = "";
$paymentlogid  = "";
$status= "";
$token = "";

$tokendetails = "";

 
  $meter  = $_POST['meter'];
  $company  = $_POST['company'];
  $payment_type  = $_POST['payment_type'];
  $customername  = $_POST['customername'];
   $accounttype  = $_POST['accounttype'];
   $amount  = $_POST['amount'];
   $phone  = $_POST['phone'];
   $thirdparty  = $_POST['thirdparty'];
   $customername  = $_POST['customername'];
  $myaccounttype = $_POST['myaccounttype'];
 $PaymentReference =   date('YmdHis').rand(2, 4567); 


// //wallet_number:wallet_number,merchantcode:merchantcode,fullname:fullname,usertype:usertype,username:username
 $registeredby  = $_POST['username'];
  $usertype = $_POST['usertype'];
 
 
 
  $depositorsname =  $_POST['fullname'];
  
  $depositorsDetails = $depositorsname."(".$merchantcode.")";
  
  $payment_type_name = $payment_type;
  
  if($payment_type == "389")
  {
	  
	 $payment_type_name =  "Electricity bills";
  }
  else  if($payment_type == "789")
  {
	   $payment_type_name =  "Reconnection bill";
  }
   else  if($payment_type == "799")
  {
	   $payment_type_name =  "New meter payment";
  }
  
 

	  $paymentlogid = date('YmdHis').rand(23, 45); 
 
 
$myName = new Name();
$my_wallet_amount=$myName->showName($conn, "SELECT sum(`amount`) FROM `e_wallet` WHERE `walletno` = '$wallet_num' AND `status` = 1"); 

	
if($amount <= $my_wallet_amount)
{
	
	 
  $curl = curl_init();
//$myaccounttype = 0;
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://fetspay.fetswallet.com/fetsIBEDC/rest/ibedcAgentBillsPay",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 300,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  
 CURLOPT_POSTFIELDS => '<PaymentNotificationRequest>\r\n<Payments><Payment>\r\n<CustReference>'.$meter.'</CustReference>\r\n<PaymentReference>'.$PaymentReference.'</PaymentReference>\r\n<ChannelName>PALL</ChannelName>\r\n<Amount>'. $amount.'</Amount>\r\n<PaymentMethod>Cash</PaymentMethod>\r\n<PaymentLogId>'.$paymentlogid.'</PaymentLogId>\r\n<PaymentDate>'.$dateformating.'</PaymentDate>\r\n<CustomerName>'.$customername.'</CustomerName>\r\n<CustomerPhoneNumber>'.$phone.'</CustomerPhoneNumber>\r\n<CustomerAddress></CustomerAddress>\r\n
<DepositorName>'.$depositorsDetails.'</DepositorName>\r\n<DepositSlipNumber>'.$PaymentReference.'</DepositSlipNumber>\r\n<ThirdPartyCode>'.$thirdparty.'</ThirdPartyCode>\r\n
<OriginalPaymentReference></OriginalPaymentReference>\r\n<IsReversal>False</IsReversal>\r\n<wallet>2349037662572</wallet>\r\n<password>3162</password>\r\n<PaymentType>'.$myaccounttype.'</PaymentType>\r\n<PaymentItems><PaymentItem>\r\n<ItemName>'.$payment_type_name .'</ItemName>\r\n<ItemAmount>'.$amount.'</ItemAmount>\r\n
<ItemCode>'.$payment_type.'</ItemCode></PaymentItem>\r\n</PaymentItems></Payment></Payments>\r\n</PaymentNotificationRequest>', 
  CURLOPT_HTTPHEADER => array(
    "cache-control: no-cache" 
  ),
));

	 
	
$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  $resp = "Oops. Something is wrong. Please try again later. ".$err;
	$response = "Failed";
	$level = "Server";
 $data = '{"resp":"'.$response.'", "Message":"'.$resp.'", "stats":"'.$level.'"}';
} else {
 //echo "Server's Response: ".$response."<p>";
 
  
 
    
$doc = new DOMDocument;
$doc->loadXML($response);

$fetsreceipt = "";
$fetsreceipt =  $doc->getElementsByTagName('FetsReceipt')->item(0)->nodeValue; // AE1001
 
$paymentlogid  =  $doc->getElementsByTagName('PaymentLogId')->item(0)->nodeValue;

$status =  $doc->getElementsByTagName('Status')->item(0)->nodeValue;
$token  =  $doc->getElementsByTagName('Token')->item(0)->nodeValue;

$tokendata =  $doc->getElementsByTagName('TokenData')->item(0)->nodeValue;
$tokendetails  =  $doc->getElementsByTagName('TokenDetails')->item(0)->nodeValue;
//TokenDetails

	$kkk = json_decode($tokendetails, TRUE);
	$kwH = $kkk["kwH"];
	$description  = $kkk["description"];
	
 


 if($status == 1)
{
	
$statusCSS = "label label-danger";
$statusParam = "Rejected";	
if(isset($phone) or $phone != "")
	{
		
 $messageValue = "Your IBEDC bill payment was NOT SUCCESSFULLY processed. Please try again later";
	$message = urlencode($messageValue);		
	 	
$url ="http://api.ebulksms.com:8080/sendsms?username=bose.tinubu@tinuten.org&apikey=da8ddb96a6242894235bbb18886dfa677ca28cbf&sender=PayAll&messagetext=".$message."&flash=0&recipients=".$phone;	


 //$send = file($url);
 
 
 
 
     
           
	}
	
 $resp = "Your IBEDC bill payment was NOT SUCCESSFULLY processed. Please try again later";
	$response = "Failed";
	$level = "Server";
 $data = '{"resp":"'.$response.'", "Message":"'.$resp.'", "stats":"'.$level.'"}';
	
}
else if($status == 0)
{
	
	$statusCSS = "label label-success";
$statusParam = "Successful";

if(isset($phone) or $phone != "")
	{

 $messageValue = "Your IBEDC bill payment was SUCCESSFULLY processed.Amount:".$amount.".RecieptNo.".$fetsreceipt.".Token:".$token;
	 $message = urlencode($messageValue);		
 		//echo $message;
$url ="http://api.ebulksms.com:8080/sendsms?username=bose.tinubu@tinuten.org&apikey=da8ddb96a6242894235bbb18886dfa677ca28cbf&sender=PayAll&messagetext=".$message."&flash=0&recipients=".$phone;	



 $send = file($url);
     
           
	}
	
	

	
}

 

$servicess = 4;
 

$update=  	mysqli_query($conn,"INSERT INTO `transactions`( `service_type`, `amount`, `status`, `sharing`, `registeredby`, `created_date`, `walletno`, `merchantcode`, `fetsreceipt`, `transaction_log`
  ,`thirdpartycode`, `accountnumber`, `customername`,`paymenttype` , `pin`) VALUES('$servicess','$amount','$status',  '-',  '$registeredby','$datetime','$wallet_num', '$merchantcode',  '$fetsreceipt', '$paymentlogid', '$thirdparty','$meter', '$customername', '$payment_type', '$token')") or die("ERROR OCCURED: ".mysqli_error($conn));

$resp = $statusParam;
	$newAmount = number_format($amount, 2);
	  
	 $data = '{"resp":"'.$resp.'", "meter":"'.$meter.'", "phone":"'.$phone.'", "amount":"'. $newAmount .'", "KWH":"'.$kwH.'", "paymenttypename":"'.$payment_type_name.'", "customername":"'.$customername.'", "fetsreceipt":"'.$fetsreceipt.'", "paymentlogid":"'.$paymentlogid.'", "status":"'.$statusParam.'", "statusCSS":"'.$statusCSS.'", "token":"'.$token.'", "datetime":"'.$datetime.'", "accounttype":"'.$accounttype.'"}';
	
	
	
	
	
	
	
	
 
}
}
else
{
 	
$resp = "Amount exceeds your wallet account! Please load your wallet to continue the transaction";
	$response = "Failed";
	$level = "Account";
 $data = '{"resp":"'.$response.'", "Message":"'.$resp.'", "stats":"'.$level.'"}';	
}
 
 
  echo json_encode($data);
 
  
  ?>