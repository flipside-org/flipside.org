---
layout: note
notes_active : true

title: Twitter Streams
category: note
image: 
tags: twitter

user: danielfdsilva
---
A project we developed required a section where the total tweet count and the last tweet made with a give hashtag were shown. This required integration with the [Twitter Stream Api](https://dev.twitter.com/docs/streaming-apis/streams/public). Our first approach was to use the twitter firehose but there were two problems with this:
- There is a lot of data coming through the firehose and a lot of processing is needed.
- The access to this endpoint is limited and special permissions are required.

After some research we found our solution. Here is how we did it:

We came across the [statuses/filters](https://dev.twitter.com/docs/api/1.1/post/statuses/filter) which is similar to the firehose except it needs to have some filter applied, either keyword or user.
During the research on how to interact with this API we found a nice script developed by [Mike Pultz](http://mikepultz.com/2013/06/mining-twitter-api-v1-1-streams-from-php-with-oauth/) which was adapted according to suggestions on his website's comments and according to our needs.
We keep the script running on a server with screen and everytime a tweet comes back it is stored in a database. The we created a simple API for our projects that returns the total count and the last tweet. As simple as that.  

## The Script
Since the script is easy and fun to use we leave our own version with some instructions.

TwitterStream.php
{% highlight php %}
<?php

/**
 * 
 * Opens a connection to the twitter stream listening for tweets
 * with the given keywords.
 * Every time a valid tweet is posted it will be sent to the processTweet()
 * method implemented by class extending TwitterStream
 * 
 * @author Mike Pultz (mike@mikepultz.com)
 *   Mike Pultz is the original author of this script.
 *   The original script can be found at: 
 *   http://mikepultz.com/2013/06/mining-twitter-api-v1-1-streams-from-php-with-oauth/
 *   All credit goes to him, I merely tweaked it.
 * @author Daniel Silva (daniel.silva@flipside.org)
 * 
 * @abstract
 */
 
abstract class TwitterStream {
  private $m_oauth_consumer_key;
  private $m_oauth_consumer_secret;
  private $m_oauth_token;
  private $m_oauth_token_secret;

  private $m_oauth_nonce;
  private $m_oauth_signature;
  private $m_oauth_signature_method = 'HMAC-SHA1';
  private $m_oauth_timestamp;
  private $m_oauth_version = '1.0';
  
  private $keywords = array();
  private $user_ids = array();
  
  /**
   * Class constructor.
   */
  public function __construct() {
    // Set script limit to none.
    set_time_limit(0);
  }
  
  /**
   * Sets the keywords to filter for the stream.
   * 
   * @param array $_keywords
   */
  public function setKeywords(array $_keywords) {
    $this->keywords = $_keywords;
    return $this;
  }
  
  /**
   * Sets the keywords to filter for the stream.
   * 
   * @param array $_user_ids
   */
  public function setUserIds(array $_user_ids) {
    $this->user_ids = $_user_ids;
    return $this;
  }

  //
  // set the login details
  //
  public function login($_consumer_key, $_consumer_secret, $_token, $_token_secret) {
    $this->m_oauth_consumer_key = $_consumer_key;
    $this->m_oauth_consumer_secret = $_consumer_secret;
    $this->m_oauth_token = $_token;
    $this->m_oauth_token_secret = $_token_secret;

    // Generate a nonce; we're just using a random md5() hash here.
    $this -> m_oauth_nonce = md5(mt_rand());

    return $this;
  }
  
  /**
   * Handles the result.
   * To be implemented by the subclass.
   * 
   * @abstract
   */
  abstract function processTweet($data);

  /**
   * Stream manager.
   */
  public function start() {
    
    if (empty($this->keywords) && empty($this->user_ids)) {
      throw new Exception("At least one keyword or user id must be set");      
    }
    
    while (1) {
      $fp = fsockopen("ssl://stream.twitter.com", 443, $errno, $errstr, 30);
      if (!$fp) {
        echo "ERROR: Twitter Stream Error: failed to open socket";
      } else {
        // Build the data and store it so we can get a length.
        $track = "";
        $follow = "";
        $request_data = "";

        if (count($this->user_ids) > 0) {
          $follow = 'follow=' . rawurlencode(implode(",", $this->user_ids));
          $request_data .= $follow;
        }

        if (count($this->keywords) > 0) {
          if (count($this->user_ids)) {
            $request_data .= "&";
          }

          $track = 'track=' . rawurlencode(implode(",", $this->keywords));
          $request_data .= $track;
        }

        // Store the current timestamp.
        $this -> m_oauth_timestamp = time();

        // Generate the base string based on all the data.
        $base_string = 'POST&' . rawurlencode('https://stream.twitter.com/1.1/statuses/filter.json') . '&';

        if (strlen($follow)) {
          $base_string .= rawurlencode($follow . '&');
        }

        $base_string .= rawurlencode('oauth_consumer_key=' . $this -> m_oauth_consumer_key . '&' . 'oauth_nonce=' . $this -> m_oauth_nonce . '&' . 'oauth_signature_method=' . $this -> m_oauth_signature_method . '&' . 'oauth_timestamp=' . $this -> m_oauth_timestamp . '&' . 'oauth_token=' . $this -> m_oauth_token . '&' . 'oauth_version=' . $this -> m_oauth_version);

        if (strlen($track)) {
          $base_string .= rawurlencode('&' . $track);
        }

        // Generate the secret key to use to hash.
        $secret = rawurlencode($this -> m_oauth_consumer_secret) . '&' . rawurlencode($this -> m_oauth_token_secret);

        // Generate the signature using HMAC-SHA1.
        // Hash_hmac() requires PHP >= 5.1.2 or PECL hash >= 1.1.
        $raw_hash = hash_hmac('sha1', $base_string, $secret, true);

        // Base64 then urlencode the raw hash.
        $this -> m_oauth_signature = rawurlencode(base64_encode($raw_hash));

        // Build the OAuth Authorization header.
        $oauth = 'OAuth oauth_consumer_key="' . $this -> m_oauth_consumer_key . '", ' . 'oauth_nonce="' . $this -> m_oauth_nonce . '", ' . 'oauth_signature="' . $this -> m_oauth_signature . '", ' . 'oauth_signature_method="' . $this -> m_oauth_signature_method . '", ' . 'oauth_timestamp="' . $this -> m_oauth_timestamp . '", ' . 'oauth_token="' . $this -> m_oauth_token . '", ' . 'oauth_version="' . $this -> m_oauth_version . '"';

        // Build the request.
        $request = "POST /1.1/statuses/filter.json HTTP/1.1\r\n";
        $request .= "Host: stream.twitter.com\r\n";
        $request .= "Authorization: " . $oauth . "\r\n";
        $request .= "Content-Length: " . strlen($request_data) . "\r\n";
        $request .= "Content-Type: application/x-www-form-urlencoded\r\n\r\n";
        $request .= $request_data;

        // Write the request.
        fwrite($fp, $request);

        // Set it to non-blocking.
        stream_set_blocking($fp, 0);

        while (!feof($fp)) {
          $read = array($fp);
          $write = null;
          $except = null;

          // Select, waiting up to 10 minutes for a tweet; if we don't get one, then
          // Then reconnect, because it's possible something went wrong.
          $res = stream_select($read, $write, $except, 600, 0);
          if (($res == false) || ($res == 0)) {
            break;
          }

          // Read the JSON object from the socket.
          $json = fgets($fp);

          // Look for a HTTP response code.
          if (strncmp($json, 'HTTP/1.1', 8) == 0) {
            $json = trim($json);
            if ($json != 'HTTP/1.1 200 OK') {
              echo 'ERROR: ' . $json . "\n";
              return false;
            }
          }

          // If there is some data, then process it.
          if (($json !== false) && (strlen($json) > 0)) {
            
            // Decode the socket to a PHP array.
            $data = json_decode($json);
            if ($data) {
              
              // Process it.
              $this->processTweet($data);
            }
          }
        }
      }

      fclose($fp);
      sleep(10);
    }

    return;
  }

};
?>
{% endhighlight %}

The TwitterStream class was made abstract so it needs to be extended.
The \_\_constructor method is used to setup credentials and keywords and every time a matching tweet is found it is sent to processTweet().
However we found that sometimes a "disconnect" response is returned so we check if the actual tweet text is present thus validating the data.

{% highlight php %}
<?php
/**
 * Class that extends TwitterStream and implements
 * the processTweet function.
 */
class Tweets extends TwitterStream {
  
  function __construct(){
    parent::__construct();
    
    // Set credentials.
    $this->login(TW_CONSUMER_KEY, TW_CONSUMER_SECRET, TW_OAUTH_ACCESS_TOKEN, TW_OAUTH_ACCESS_TOKEN_SECRET)
    // Keywords to track. Tweets with 'fun' and 'play' will be returned.
    ->setKeywords(array('fun', 'play'))
    ->start();
  }
  
  public function processTweet($data) {
    
    // The return object could be an invalid tweet.
    // Could be something like:
    // stdClass Object
    // (
    //     [disconnect] => stdClass Object
    //         (
    //             [code] => 7
    //             [stream_name] => flipside_org-statuses87289
    //             [reason] => admin logout
    //         )
    // )
    if (isset($data->text)) {
      
      // Handle the tweet
      
    }
  }  
}

new Tweets();
?> 
{% endhighlight %}