Imports System.Windows.Forms

Public Class Form1
    Private Sub Form1_Load(sender As Object, e As EventArgs) Handles MyBase.Load
        ' Navigate to the web page
        WebBrowser1.Navigate(New Uri("https://www.your-link.com"))
    End Sub

    Private Sub WebBrowser1_DocumentCompleted(sender As Object, e As WebBrowserDocumentCompletedEventArgs) Handles WebBrowser1.DocumentCompleted
        Dim form = WebBrowser1.Document.Forms(0)

        ' Fill in details
        form.All("username").SetAttribute("value", "your-username")
        form.All("password").SetAttribute("value", "your-password")

        ' Submit
        form.InvokeMember("submit")
    End Sub
End Class