#!/bin/bash

# ==========================================================
# Student Name: [Your Name]
# Student ID: [Your ID]
# Partner Name: [Partner Name]
# Partner ID: [Partner ID]
# Description: Menu-driven system management and math script
# ==========================================================

# Initialize variables for Option 2 and 3
numbers=()

while true; do
    echo "------------------------------------------"
    echo "       SYSTEM MANAGEMENT MENU             "
    echo "------------------------------------------"
    echo "1. Print User and System Information"
    echo "2. Even/Odd Number Checker (1-100)"
    echo "3. Export Data to .txt File"
    echo "4. Exit"
    echo "------------------------------------------"
    read -p "Please choose an option [1-4]: " choice

    case $choice in
        1)
            echo "--- System Information ---"
            echo "Date and Time: $(date)"
            echo "Home Directory: $HOME"
            echo "User ID: $UID"
            echo "Current Shell: $SHELL"
            echo "Files and Folders (Column Format):"
            ls -C
            ;;

        2)
            echo "Enter numbers between 1 and 100 (Enter 0 to stop):"
            # Logic: Use a 'while' loop here to 'read' numbers
            # Check if number is 0 (sentinel) to break the loop
            # Use 'if [ $num -ge 1 ] && [ $num -le 100 ]' to validate range
            # Use $(( num % 2 )) to check for Even (0) or Odd (1)
            ;;

        3)
            echo "Exporting data to output.txt..."
            # Logic: Use 'echo' with '>' to create the file
            # You will need to calculate the average, max, and min
            # Example: echo "Average: $avg" >> output.txt
            ;;

        4)
            echo "Exiting program. Goodbye!"
            exit 0
            ;;

        *)
            echo "Error: Invalid option. Please try again."
            ;;
    esac
    echo "" # Adds a blank line for readability
done
