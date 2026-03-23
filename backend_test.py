#!/usr/bin/env python3
"""
Backend API Testing for Last The Puff Film Website
Tests all backend API endpoints for the cinematic marketing funnel
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Base URL from environment
BASE_URL = "https://final-inhale.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class LastThePuffAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_results = []
        self.initial_count = None
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()

    def test_health_check(self):
        """Test health check endpoint"""
        print("🔍 Testing Health Check API...")
        
        try:
            # Test root endpoint
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    self.log_result(
                        "Health Check (Root)", 
                        True, 
                        "Root endpoint returns healthy status",
                        {'response': data}
                    )
                else:
                    self.log_result(
                        "Health Check (Root)", 
                        False, 
                        f"Unexpected response format: {data}"
                    )
            else:
                self.log_result(
                    "Health Check (Root)", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
            # Test health endpoint
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    self.log_result(
                        "Health Check (/health)", 
                        True, 
                        "Health endpoint returns healthy status",
                        {'response': data}
                    )
                else:
                    self.log_result(
                        "Health Check (/health)", 
                        False, 
                        f"Unexpected response format: {data}"
                    )
            else:
                self.log_result(
                    "Health Check (/health)", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Health Check", False, f"Exception occurred: {str(e)}")

    def test_get_access_count(self):
        """Test get access count endpoint"""
        print("🔍 Testing Get Access Count API...")
        
        try:
            response = self.session.get(f"{API_BASE}/access-requests/count")
            
            if response.status_code == 200:
                data = response.json()
                if 'count' in data and isinstance(data['count'], int):
                    self.initial_count = data['count']
                    # Should be at least base count of 1247
                    if data['count'] >= 1247:
                        self.log_result(
                            "Get Access Count", 
                            True, 
                            f"Successfully retrieved count: {data['count']}",
                            {'count': data['count'], 'base_count_included': True}
                        )
                    else:
                        self.log_result(
                            "Get Access Count", 
                            False, 
                            f"Count {data['count']} is less than expected base count 1247"
                        )
                else:
                    self.log_result(
                        "Get Access Count", 
                        False, 
                        f"Invalid response format: {data}"
                    )
            else:
                self.log_result(
                    "Get Access Count", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Get Access Count", False, f"Exception occurred: {str(e)}")

    def test_submit_access_request_valid(self):
        """Test submitting a valid access request"""
        print("🔍 Testing Submit Valid Access Request...")
        
        # Generate unique test data
        import random
        unique_num = random.randint(1000, 9999)
        test_data = {
            "name": f"John Doe {unique_num}",
            "phone": f"+1-555-{unique_num:04d}",
            "email": f"john.doe.{unique_num}@testmail.com",
            "college": "Test University",
            "interest": "Film Production"
        }
        
        try:
            response = self.session.post(
                f"{API_BASE}/access-requests",
                json=test_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 201:
                data = response.json()
                if (data.get('success') and 
                    data.get('message') == 'You are now on the premiere list.' and
                    'id' in data):
                    self.log_result(
                        "Submit Valid Access Request", 
                        True, 
                        "Successfully submitted access request",
                        {'response': data, 'test_data': test_data}
                    )
                    return test_data  # Return for duplicate testing
                else:
                    self.log_result(
                        "Submit Valid Access Request", 
                        False, 
                        f"Unexpected response format: {data}"
                    )
            else:
                self.log_result(
                    "Submit Valid Access Request", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Submit Valid Access Request", False, f"Exception occurred: {str(e)}")
            
        return None

    def test_count_increment(self):
        """Test that count incremented after submission"""
        print("🔍 Testing Count Increment After Submission...")
        
        if self.initial_count is None:
            self.log_result("Count Increment", False, "Initial count not available")
            return
            
        try:
            response = self.session.get(f"{API_BASE}/access-requests/count")
            
            if response.status_code == 200:
                data = response.json()
                new_count = data.get('count')
                
                if new_count > self.initial_count:
                    self.log_result(
                        "Count Increment", 
                        True, 
                        f"Count increased from {self.initial_count} to {new_count}",
                        {'initial_count': self.initial_count, 'new_count': new_count}
                    )
                else:
                    self.log_result(
                        "Count Increment", 
                        False, 
                        f"Count did not increase: {self.initial_count} -> {new_count}"
                    )
            else:
                self.log_result(
                    "Count Increment", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Count Increment", False, f"Exception occurred: {str(e)}")

    def test_duplicate_prevention(self, test_data):
        """Test duplicate prevention"""
        print("🔍 Testing Duplicate Prevention...")
        
        if not test_data:
            self.log_result("Duplicate Prevention", False, "No test data available")
            return
            
        try:
            # Try to submit the same data again
            response = self.session.post(
                f"{API_BASE}/access-requests",
                json=test_data,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                data = response.json()
                if (data.get('success') and 
                    data.get('alreadyExists') and
                    'already on the premiere list' in data.get('message', '').lower()):
                    self.log_result(
                        "Duplicate Prevention", 
                        True, 
                        "Successfully prevented duplicate submission",
                        {'response': data}
                    )
                else:
                    self.log_result(
                        "Duplicate Prevention", 
                        False, 
                        f"Unexpected response for duplicate: {data}"
                    )
            else:
                self.log_result(
                    "Duplicate Prevention", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Duplicate Prevention", False, f"Exception occurred: {str(e)}")

    def test_validation_missing_fields(self):
        """Test validation for missing required fields"""
        print("🔍 Testing Validation - Missing Required Fields...")
        
        test_cases = [
            {"phone": "+15551234567", "email": "test@example.com"},  # Missing name
            {"name": "John Doe", "email": "test@example.com"},       # Missing phone
            {"name": "John Doe", "phone": "+15551234567"},           # Missing email
            {}  # Missing all
        ]
        
        for i, test_data in enumerate(test_cases):
            try:
                response = self.session.post(
                    f"{API_BASE}/access-requests",
                    json=test_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 400:
                    data = response.json()
                    if 'error' in data and 'required' in data['error'].lower():
                        self.log_result(
                            f"Validation Missing Fields #{i+1}", 
                            True, 
                            f"Correctly rejected missing fields: {data['error']}",
                            {'test_data': test_data, 'response': data}
                        )
                    else:
                        self.log_result(
                            f"Validation Missing Fields #{i+1}", 
                            False, 
                            f"Wrong error message: {data}"
                        )
                else:
                    self.log_result(
                        f"Validation Missing Fields #{i+1}", 
                        False, 
                        f"Expected 400, got {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(f"Validation Missing Fields #{i+1}", False, f"Exception: {str(e)}")

    def test_validation_invalid_email(self):
        """Test email format validation"""
        print("🔍 Testing Email Format Validation...")
        
        invalid_emails = [
            "invalid-email",
            "test@",
            "@example.com",
            "test.example.com",
            "test@.com"
        ]
        
        for i, invalid_email in enumerate(invalid_emails):
            test_data = {
                "name": "John Doe",
                "phone": "+15551234567",
                "email": invalid_email
            }
            
            try:
                response = self.session.post(
                    f"{API_BASE}/access-requests",
                    json=test_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 400:
                    data = response.json()
                    if 'error' in data and 'email' in data['error'].lower():
                        self.log_result(
                            f"Email Validation #{i+1}", 
                            True, 
                            f"Correctly rejected invalid email '{invalid_email}': {data['error']}"
                        )
                    else:
                        self.log_result(
                            f"Email Validation #{i+1}", 
                            False, 
                            f"Wrong error message: {data}"
                        )
                else:
                    self.log_result(
                        f"Email Validation #{i+1}", 
                        False, 
                        f"Expected 400, got {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(f"Email Validation #{i+1}", False, f"Exception: {str(e)}")

    def test_validation_invalid_phone(self):
        """Test phone format validation"""
        print("🔍 Testing Phone Format Validation...")
        
        invalid_phones = [
            "123",           # Too short
            "abcdefghij",    # Letters
            "123-456-78901234567890",  # Too long
            "invalid-phone",  # Invalid format
        ]
        
        for i, invalid_phone in enumerate(invalid_phones):
            test_data = {
                "name": "John Doe",
                "phone": invalid_phone,
                "email": "test@example.com"
            }
            
            try:
                response = self.session.post(
                    f"{API_BASE}/access-requests",
                    json=test_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if response.status_code == 400:
                    data = response.json()
                    if 'error' in data and 'phone' in data['error'].lower():
                        self.log_result(
                            f"Phone Validation #{i+1}", 
                            True, 
                            f"Correctly rejected invalid phone '{invalid_phone}': {data['error']}"
                        )
                    else:
                        self.log_result(
                            f"Phone Validation #{i+1}", 
                            False, 
                            f"Wrong error message: {data}"
                        )
                else:
                    self.log_result(
                        f"Phone Validation #{i+1}", 
                        False, 
                        f"Expected 400, got {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(f"Phone Validation #{i+1}", False, f"Exception: {str(e)}")

    def test_admin_get_requests(self):
        """Test admin endpoint to get all access requests"""
        print("🔍 Testing Admin Get Access Requests...")
        
        try:
            response = self.session.get(f"{API_BASE}/access-requests")
            
            if response.status_code == 200:
                data = response.json()
                if 'requests' in data and isinstance(data['requests'], list):
                    self.log_result(
                        "Admin Get Requests", 
                        True, 
                        f"Successfully retrieved {len(data['requests'])} access requests",
                        {'count': len(data['requests'])}
                    )
                else:
                    self.log_result(
                        "Admin Get Requests", 
                        False, 
                        f"Invalid response format: {data}"
                    )
            else:
                self.log_result(
                    "Admin Get Requests", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result("Admin Get Requests", False, f"Exception occurred: {str(e)}")

    def run_all_tests(self):
        """Run all backend API tests"""
        print("🚀 Starting Last The Puff Backend API Tests")
        print("=" * 60)
        
        # Test sequence
        self.test_health_check()
        self.test_get_access_count()
        
        # Submit a valid request and test related functionality
        test_data = self.test_submit_access_request_valid()
        time.sleep(1)  # Brief pause for database consistency
        
        self.test_count_increment()
        self.test_duplicate_prevention(test_data)
        
        # Validation tests
        self.test_validation_missing_fields()
        self.test_validation_invalid_email()
        self.test_validation_invalid_phone()
        
        # Admin endpoint
        self.test_admin_get_requests()
        
        # Summary
        print("=" * 60)
        print("🏁 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return passed_tests == total_tests

if __name__ == "__main__":
    tester = LastThePuffAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)