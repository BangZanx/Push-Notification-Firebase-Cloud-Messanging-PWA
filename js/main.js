document.addEventListener('contextmenu', event => event.preventDefault());

var domain = "http://127.0.0.1:5500/";
var c = document.querySelector('p[class="mt-2"]').textContent;

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: domain + "home.html",
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            $("#content").html(result);
        }
    });
});

$('a.home').bind('click', function(event) {
    $.ajax({
        type: 'GET',
        url: domain + "home.html",
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            $("#content").html(result);
        }
    });
});
$('a.about').bind('click', function(event) {
    $.ajax({
        type: 'GET',
        url: domain + "about.html",
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            $("#content").html(result);
        }
    });
});

$('a.skill').bind('click', function(event) {
    $.ajax({
        type: 'GET',
        url: domain + "skill.html",
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            $("#content").html(result);
        }
    });
});

$('a.contact').bind('click', function(event) {
    $.ajax({
        type: 'GET',
        url: domain + "contact.html",
        cache: false,
        processData: false,
        contentType: false,
        success: function(result) {
            $("#content").html(result);

            // Tangani pengiriman form ke database IndexedDB
document.querySelector('#contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var name = document.querySelector('#name').value;
    var comment = document.querySelector('#comment').value;

    // Buka database
    var request = indexedDB.open('MyDatabase', 1);

    request.onsuccess = function(event) {
        var db = event.target.result;

        // Mulai transaksi
        var transaction = db.transaction('contacts', 'readwrite');
        var contactStore = transaction.objectStore('contacts');

        // Tambahkan data ke toko data
        var newContact = { name: name, comment: comment };
        var addRequest = contactStore.add(newContact);

        addRequest.onsuccess = function() {
            console.log('Data added to database');
            alert('Terimakasih Atas Komentarnya');
            // Mungkin Anda ingin menampilkan pesan sukses atau melakukan tindakan lain di sini.
        };

        addRequest.onerror = function() {
            console.error('Error adding data to database:', addRequest.error);
            alert('Komen Anda Error');
        };
    };

    request.onerror = function(event) {
        console.error("Error opening database:", event.target.error);
    };
});
        }
    });
});

  // Membuka atau membuat database IndexedDB
var request = indexedDB.open('MyDatabase', 1);

// Menangani event ketika database terbuka atau diperbarui
request.onupgradeneeded = function(event) {
    var db = event.target.result;

    // Buat objek toko data
    var contactStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });

    // Buat indeks untuk pencarian
    contactStore.createIndex('name', 'name', { unique: false });
};

// Tangani kesalahan ketika membuka database
request.onerror = function(event) {
    console.error("Error opening database:", event.target.error);
};

// Tangani kesuksesan ketika database dibuka
request.onsuccess = function(event) {
    var db = event.target.result;
    console.log("Database opened successfully");

    // Lalu, Anda dapat menggunakan objek db untuk berinteraksi dengan database.
    // Anda dapat menambahkan, mengambil, atau menghapus data dari toko data 'contacts' di sini.
};


// Firebase Cloud Messaging
window.onload = () => {
"use strict";

const notificationButton = document.getElementById("enableNotifications");
let swRegistration = null;
const TokenElem = document.getElementById("token");
const ErrElem = document.getElementById("err");

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
const config = {
  apiKey: "AIzaSyAeC48tWmmEh-7l1ohQInHarxnXFFb4VTE",
  authDomain: "push-notification-f44bc.firebaseapp.com",
  projectId: "push-notification-f44bc",
  storageBucket: "push-notification-f44bc.appspot.com",
  messagingSenderId: "596477331367",
  appId: "1:596477331367:web:29c009c759ab90b7855882",
  measurementId: "G-P0WC00XZ8M"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");
    initializeUi();
    initializeFCM();

    //Register the service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);
        swRegistration = swReg;
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
    navigator.serviceWorker.ready.then(function(registration) {
      console.log("A service worker is active:", registration.active);

      // At this point, you can call methods that require an active
      // service worker, like registration.pushManager.subscribe()
    });
  } else {
    console.warn("Push messaging is not supported");
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
}

function initializeFCM() {
  messaging
    .requestPermission()
    .then(() => {
      console.log("Notification permission granted.");

      // get the token in the form of promise
      return messaging.getToken();
    })
    .then(token => {
      TokenElem.innerHTML = "token is : " + token;
    })
    .catch(err => {
      ErrElem.innerHTML = ErrElem.innerHTML + "; " + err;
      console.log("Unable to get permission to notify.", err);
    });
}

function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  }
  // If the user hasn't told if he wants to be notified or not
  // Note: because of Chrome, we are not sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function notification() {
  const options = {
    body: "Notification Actived",
    icon: "./img/bangozanx.png"
  };
  swRegistration.showNotification("PWA Notification!", options);
}
}