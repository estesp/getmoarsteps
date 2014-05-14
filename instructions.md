Get started with ${app}
-----------------------------------
Welcome to your new Ruby on Rails app!

Ruby on Rails app that will get you up and running quickly!

1. [Install the cf command-line tool](${doc-url}/redirect.jsp?name=cf-instructions).
2. [Download the starter application package](${ace-url}/rest/apps/${app-guid}/starter-download).
3. Extract the package and `cd` to it.
4. Connect to BlueMix:

		cf api ${api-url}

5. Log into BlueMix:

		cf login -u ${username}
		cf target -o ${org} -s ${space}
		
6. Deploy your app:

		cf push ${app}

7. Access your app: [${route}](//${route})
